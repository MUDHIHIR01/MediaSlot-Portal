import PageMeta from "../../components/common/PageMeta";
import RestePassword from "../../components/auth/RestePassword";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="MY APP"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
     
        <RestePassword />
     
    </>
  );
}
