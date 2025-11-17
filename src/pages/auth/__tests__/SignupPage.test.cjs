/**
 * SignupPage.test.cjs — FULLY WORKING FOR VITE + JEST (CJS MODE)
 */

 const React = require("react");
 const { render, screen, fireEvent, waitFor } = require("@testing-library/react");
 
 // ------------------------------
 // 1. Mock Vite import.meta.env
 // ------------------------------
 global.importMetaEnv = { VITE_API_HOST: "http://localhost" };
 global.__vite_import_meta__ = { env: global.importMetaEnv };
 global.importMeta = { env: global.importMetaEnv };
 
 // ------------------------------
 // 2. Mock TextEncoder/TextDecoder
 // ------------------------------
 const { TextEncoder, TextDecoder } = require("util");
 global.TextEncoder = TextEncoder;
 global.TextDecoder = TextDecoder;
 
 // ------------------------------
 // 3. Mock react-router-dom (NO JSX!)
 // ------------------------------
 const mockNavigate = jest.fn();
 
 jest.mock("react-router-dom", () => {
   const React = require("react");
 
   return {
     useNavigate: () => mockNavigate,
     Link: ({ to, children }) =>
       React.createElement("a", { href: to }, children),
   };
 });
 
 // ------------------------------
 // 4. Mock axios
 // ------------------------------
 jest.mock("axios");
 const axios = require("axios");
 
 // ------------------------------
 // 5. Mock Redux
 // ------------------------------
 const mockDispatch = jest.fn();
 jest.mock("react-redux", () => ({
   useDispatch: () => mockDispatch,
 }));
 
 // ------------------------------
 // 6. Import component (AFTER mocks)
 // ------------------------------
 const SignupPage = require("../SignupPage").default;
 
 // ==================================================================
 // TESTS
 // ==================================================================
 
 describe("SignupPage", () => {
   beforeEach(() => {
     jest.clearAllMocks();
   });
 
   test("renders signup form fields", () => {
     render(React.createElement(SignupPage));
 
     expect(screen.getByText("Create an Account")).toBeInTheDocument();
     expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
     expect(
       screen.getByPlaceholderText("Enter password (8-12 chars)")
     ).toBeInTheDocument();
     expect(screen.getByPlaceholderText("10-digit number")).toBeInTheDocument();
   });
 
   test("shows validation errors for empty submit", async () => {
     render(React.createElement(SignupPage));
 
     fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
 
     expect(await screen.findByText("Email must not be empty.")).toBeInTheDocument();
     expect(
       screen.getByText("Password cannot be blank.")
     ).toBeInTheDocument();
     expect(
       screen.getByText("Phone number must be exactly 10 digits.")
     ).toBeInTheDocument();
   });
 
   test("successful signup redirects to login", async () => {
     axios.post.mockResolvedValue({
       data: { message: "User created" },
     });
 
     render(React.createElement(SignupPage));
 
     fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
       target: { name: "userEmail", value: "test@gmail.com" },
     });
 
     fireEvent.change(screen.getByPlaceholderText("Enter password (8-12 chars)"), {
       target: { name: "userPassword", value: "password1" },
     });
 
     fireEvent.change(screen.getByPlaceholderText("10-digit number"), {
       target: { name: "userPhoneNumber", value: "9876543210" },
     });
 
     fireEvent.change(
       screen.getByPlaceholderText("Enter full address (50-500 chars)"),
       {
         target: {
           name: "userAddress",
           value: "a".repeat(55),
         },
       }
     );
 
     fireEvent.change(screen.getByRole("combobox"), {
       target: { name: "role", value: "CUSTOMER" },
     });
 
     fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
 
     await waitFor(() => {
       expect(mockNavigate).toHaveBeenCalledWith("/login");
     });
   });
 
   test("shows backend error", async () => {
     axios.post.mockRejectedValue({
       response: { data: { message: "Email already exists" } },
     });
 
     render(React.createElement(SignupPage));
 
     fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
       target: { name: "userEmail", value: "already@gmail.com" },
     });
 
     fireEvent.change(screen.getByPlaceholderText("Enter password (8-12 chars)"), {
       target: { name: "userPassword", value: "password1" },
     });
 
     fireEvent.change(screen.getByPlaceholderText("10-digit number"), {
       target: { name: "userPhoneNumber", value: "9998887777" },
     });
 
     fireEvent.change(
       screen.getByPlaceholderText("Enter full address (50-500 chars)"),
       {
         target: {
           name: "userAddress",
           value: "a".repeat(55),
         },
       }
     );
 
     fireEvent.change(screen.getByRole("combobox"), {
       target: { name: "role", value: "CUSTOMER" },
     });
 
     fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
 
     expect(await screen.findByText("Email already exists")).toBeInTheDocument();
   });
 });
 