import React, { Suspense } from "react";
import ClientPassreset from "../components/authclient";

export default function PasswordReset() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPassreset />
    </Suspense>
  );
}
