// src/pages/auth/__tests__/LoginPage.test.cjs
// NOTE: This file uses CommonJS because your jest config is CJS.

"use strict";

// 0) polyfills that must exist BEFORE importing the component
global.__vite_import_meta__ = { env: { VITE_API_HOST: "http://localhost" } };
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 1) mock axios as an object with a mock 'post' function
const axiosMock = { post: jest.fn() };
jest.mock("axios", () => axiosMock);
const axios = require("axios");

// 2) mock react-redux BEFORE importing component
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// 3) mock react-router-dom BEFORE importing component
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => `<a href="${to}">${children}</a>`,
  };
});

// 4) now import testing utilities and the component
const { render, screen, fireEvent, waitFor } = require("@testing-library/react");
const LoginPage = require("../LoginPage").default; // relative to __tests__ folder

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the login heading and inputs", () => {
    render(require("react").createElement(LoginPage));
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    // now that labels are associated, this will work:
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("shows validation errors when submitted empty", async () => {
    render(require("react").createElement(LoginPage));
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Email must not be empty.")).toBeInTheDocument();
    expect(screen.getByText("Password cannot be blank.")).toBeInTheDocument();
  });

  test("successful login redirects based on role", async () => {
    // arrange axios to resolve (simulate backend)
    axios.post.mockResolvedValueOnce({ data: { role: "CUSTOMER", name: "Vedant" } });

    render(require("react").createElement(LoginPage));

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@gmail.com", name: "userEmail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "123456", name: "userPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/customer");
    });
  });

  test("shows backend error message on failed login", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(require("react").createElement(LoginPage));

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@gmail.com", name: "userEmail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpass", name: "userPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
