import { Routes, Route } from "react-router-dom";

import "./global.css";
import { Home } from "./_root/pages";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public Route */}
        <Route element={<AuthLayout />}>
          <Route path="/sigh-in" element={<SignInForm />} />
          <Route path="/sigh-up" element={<SignUpForm />} />
        </Route>

        {/* Private Route */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
