
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import ChangePasswordClient from "../components/changepassword";

const ChangePasswordPage = async () => {
  const session = await getSession();
  // Check if session is defined
  if (!session || !session.email) {
    return <div>No session found. Please log in</div>;
  }

  const data = await db.MartSeller.findFirst({
    where: { email: session.email },
  });

  // Check if data is found
  if (!data) {
    return <div>No User found</div>;
  }

  return (
    <div>
     <ChangePasswordClient/>
    </div>
  );
};

export default ChangePasswordPage;
