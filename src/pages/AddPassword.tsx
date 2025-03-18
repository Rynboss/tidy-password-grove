
import React from "react";
import Layout from "@/components/Layout";
import PasswordForm from "@/components/PasswordForm";

const AddPassword: React.FC = () => {
  return (
    <Layout title="Add Password" showBackButton>
      <div className="w-full max-w-lg mx-auto">
        <PasswordForm />
      </div>
    </Layout>
  );
};

export default AddPassword;
