import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";

import { useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const AuthPage = () => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    purpose: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const iconAdornment = (icon) => (
    <InputAdornment position="start">{icon}</InputAdornment>
  );

  const labelStyle = {
    sx: { fontSize: "0.75rem" },
  };

  const handleLogin = async () => {
  try {
    setIsSubmitting(true);

    await new Promise((res) => setTimeout(res, 300));

    await signInWithEmailAndPassword(auth, email, password);

  } catch (err) {
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loading) return;

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          purpose: form.purpose,
          createdAt: serverTimestamp(),
        });

      } else {
        await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
      }

      setIsAnimating(true);

      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsSlidingOut(true);
        }, 1200);
      });

    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters");
          break;
        case "auth/user-not-found":
          setError("User not found");
          break;
        case "auth/wrong-password":
          setError("Wrong password");
          break;
        default:
          setError("Something went wrong");
      }
    }

    setLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div
        className={`absolute top-0 left-0 z-10
        bg-linear-to-br from-gray-900 via-gray-600 to-gray-400 dark:from-gray-900 dark:via-gray-600 dark:to-gray-300
        shadow-2xl
        transition-all duration-1800 ease-[cubic-bezier(0.77,0,0.175,1)]

        ${isSlidingOut
            ? "w-full h-full translate-y-full md:translate-y-0 md:translate-x-full"
            : isAnimating
              ? "w-full h-full"
              : "w-full h-[40%] md:w-1/2 md:h-full rounded-b-[90px] md:rounded-r-[150px] md:rounded-bl-none md:rounded-br-[150px]"
          }`}
      >
        <div className="h-full flex flex-col justify-center items-center text-white text-center px-6 md:px-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {isSignup ? "Join Us" : "Welcome Back"}
          </h1>

          <p className="text-white/80 mb-6">
            {isSignup
              ? "Create your account and start your journey."
              : "Login to continue."}
          </p>

          <div className="flex gap-4 text-white text-xl">
            <GoogleIcon />
            <GitHubIcon />
            <FacebookIcon />
          </div>
        </div>
      </div>

      <div
        className={`absolute z-40 transition-all duration-500 w-full px-6 top-[40%] text-center md:top-0 md:right-0 md:w-1/2 md:h-full flex justify-center md:items-center

        ${isAnimating
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
          }`}
      >
        <div className="form-scroll w-full max-w-125 mt-10 md:mt-0 max-h-[40vh] md:max-h-full overflow-y-auto pr-2">

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              {isSignup ? "Sign Up" : "Login"}
            </Typography>

            {isSignup && (<Box sx={{ display: "flex", gap: 2, mt: 3, flexDirection: { xs: "column", md: "row" }, }} > <TextField fullWidth label="First Name" value={form.firstName} onChange={handleChange("firstName")} margin="dense" InputLabelProps={labelStyle} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }} InputProps={{ startAdornment: iconAdornment(<PersonIcon />), }} /> <TextField fullWidth label="Last Name" value={form.lastName} onChange={handleChange("lastName")} margin="dense" InputLabelProps={labelStyle} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }} InputProps={{ startAdornment: iconAdornment(<PersonIcon />), }} /> </Box>)} <TextField fullWidth label="Email" value={form.email} onChange={handleChange("email")} margin="dense" InputLabelProps={labelStyle} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }} InputProps={{ startAdornment: iconAdornment(<EmailIcon />), }} /> <TextField fullWidth label="Password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange("password")} margin="dense" InputLabelProps={labelStyle} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }} InputProps={{ startAdornment: iconAdornment(<LockIcon />), endAdornment: (<InputAdornment position="end"> <IconButton onClick={() => setShowPassword((p) => !p)}> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment>), }} /> {isSignup && (<> <TextField fullWidth label="Confirm Password" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange("confirmPassword")} margin="dense" InputLabelProps={labelStyle} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }} /> <TextField fullWidth select label="Purpose" value={form.purpose} onChange={handleChange("purpose")} margin="dense" InputLabelProps={labelStyle} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px" } }} > <MenuItem value="student">Student</MenuItem> <MenuItem value="developer">Developer</MenuItem> <MenuItem value="designer">Designer</MenuItem> <MenuItem value="freelancer">Freelancer</MenuItem> <MenuItem value="other">Other</MenuItem> </TextField> </>)}

            {error && (
              <Typography color="error" fontSize={13} mt={1}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: "14px",
                background: "#4F6B86",
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isSignup ? "Create Account" : "Login"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "Don't have an account? Create one"}
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;