import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Navigate } from "react-router-dom";

export default function SignIn() {
  const user = useSelector((state: RootState) => state.auth.user);
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageMeta title="SignIn Dashboard" description="" />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
