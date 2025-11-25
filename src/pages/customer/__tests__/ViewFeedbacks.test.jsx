// ------------------------------
// 1. Mock Vite import.meta BEFORE ANY IMPORT
// ------------------------------
global.__vite_import_meta__ = {
  env: {
    VITE_API_HOST: "http://localhost"
  }
};

// ------------------------------
// 2. Mock axios before importing component
// ------------------------------
jest.mock("axios");
const axios = require("axios");

// ------------------------------
// 3. Mock React Router
// ------------------------------
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

// ------------------------------
// 4. Mock Redux useSelector
// ------------------------------
let mockUserState = null;

jest.mock("react-redux", () => ({
  useSelector: (fn) => fn({ user: mockUserState })
}));

// ------------------------------
// 5. Testing Library imports
// ------------------------------
const { render, screen, waitFor } = require("@testing-library/react");

// ------------------------------
// 6. Import component AFTER mocks
// ------------------------------
const ViewFeedbacks = require("../ViewFeedbacks.jsx").default;

// ======================================================================
// TESTS
// ======================================================================
describe("ViewFeedbacks Page", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserState = { userId: 2, token: "validToken" };
  });

  test("redirects if user has no ID", () => {
    mockUserState = { userId: null, token: "validToken" };

    render(<ViewFeedbacks />);

    expect(mockNavigate).toHaveBeenCalledWith("/customer");
  });

  test("shows login error if token missing", () => {
    mockUserState = { userId: 10, token: null };

    render(<ViewFeedbacks />);

    expect(screen.getByText("You must be logged in to view feedbacks.")).toBeInTheDocument();
  });

  test("loads and displays feedbacks", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          subject: "Test subject",
          message: "Test feedback msg",
          type: "FEEDBACK",
          status: "OPEN",
          createdAt: "2024-01-01T10:00:00Z"
        }
      ]
    });

    render(<ViewFeedbacks />);

    expect(screen.getByText("My Feedbacks & Complaints")).toBeInTheDocument();

    // Wait for fetch
    await waitFor(() => {
      expect(screen.getByText("Test subject")).toBeInTheDocument();
      expect(screen.getByText("Test feedback msg")).toBeInTheDocument();
    });
  });

  test("shows 'no feedbacks' when array empty", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<ViewFeedbacks />);

    await waitFor(() => {
      expect(screen.getByText("No feedbacks or complaints yet.")).toBeInTheDocument();
    });
  });

  test("shows backend error", async () => {
    axios.get.mockRejectedValue({
      response: { data: { message: "Server boom" } }
    });

    render(<ViewFeedbacks />);

    await waitFor(() => {
      expect(screen.getByText("Server boom")).toBeInTheDocument();
    });
  });
});
