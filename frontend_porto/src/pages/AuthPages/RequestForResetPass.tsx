import PageMeta from "../../components/common/PageMeta";
import RequestToResetPassword from "../../components/auth/RequestToResetPassword";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="MY APP"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
     
        <RequestToResetPassword/>
     
    </>
  );
}
