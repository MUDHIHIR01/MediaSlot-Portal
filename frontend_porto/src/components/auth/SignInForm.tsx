import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    e.stopPropagation(); // Stop event bubbling

    setIsLoading(true);

    const attemptLogin = async (retries = 2): Promise<void> => {
      try {
        const response = await axiosInstance.post('/api/auth/login', { email, password });
        const successMessage = response.data.message || "Login successful!";
        toast.success(successMessage, { position: "top-right", autoClose: 3000 });
        // Store data in localStorage
        localStorage.setItem("token", response.data.token as string);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role_id", response.data.role_id as string);
        setIsLoading(false);
        navigate("/dashboard"); // Navigate only on success
      } catch (err) {
        const error = err as import("axios").AxiosError<{ message?: string }>;
        if (error.request && retries > 0) {
          toast.warn("Network issue detected, retrying...", { position: "top-right", autoClose: 1000 });
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s
          return attemptLogin(retries - 1);
        }
        throw err; // Rethrow for outer catch
      }
    };

    try {
      await attemptLogin();
    } catch (err) {
      setIsLoading(false); // Reset loading state on error
      const error = err as import("axios").AxiosError<{ message?: string }>;
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "An error occurred";
        switch (status) {
          case 401:
            toast.error(message, { position: "top-right", autoClose: 3000 }); // "Invalid credentials"
            break;
          case 403:
            toast.error(message, { position: "top-right", autoClose: 3000 }); // "Account is not active"
            break;
          case 500:
            toast.error(message, { position: "top-right", autoClose: 3000 }); // "An error occurred"
            break;
          default:
            toast.error(message, { position: "top-right", autoClose: 3000 }); // Any other error
        }
      } else if (error.request) {
        toast.error("Failed to connect to server after retries", { position: "top-right", autoClose: 3000 });
      } else {
        console.error("Unexpected error:", error.message);
        toast.error("Something went wrong. Please try again later", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleCheckboxChange = (checked: boolean) => setIsChecked(checked);

  const handleLogoClick = () => navigate("/");

  return (
    <div className="flex shadow-md flex-col flex-1 items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            width={100}
            height={48}
            src="/logo.png"
            alt="Logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <div
        className="w-full max-w-md p-8 py-4 bg-white rounded-lg dark:bg-gray-800"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
        }}
      >
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="info@gmail.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <Link
                to="/request-for/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>

            <div>
              <Button
                className="w-full relative"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Don’t have an account?{" "}
              <Link to="/sign-up" className="text-blue-600 hover:text-blue-700">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}