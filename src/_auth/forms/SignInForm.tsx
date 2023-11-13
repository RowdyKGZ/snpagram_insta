import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SingInValidation } from "@/lib/validations";
import Loader from "@/components/shared/Loader";
import { useSignInAccount } from "@/lib/react-query/querisAndMutation";
import { useUserContext } from "../../context/AuthContext";

const SignInForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLaoding } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SingInValidation>>({
    resolver: zodResolver(SingInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SingInValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      alert("SignIn failed. Please try again");
      return toast({ title: "SignIn failed. Please try again" });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      alert("Sign in failed. Please try again");

      return toast({ title: "Sign in failed. Please try again" });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col mb-24">
        <img src="/assets/images/logo.svg" alt="" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          LogIn to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back to snapgramm
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email"
                    {...field}
                    className="shad-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pssword</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="password"
                    {...field}
                    className="shad-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isUserLaoding ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an acount ?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
