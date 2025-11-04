// app/superprofile/e-seva/[esevaid]/subadmin/page.js

import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"
import { redirect } from "next/navigation"
import SubAdminList from "../../[esevaid]/components/subadminlist"

export const dynamic = "force-dynamic"

const SubAdminPage = async ({ params }) => {
  // ✅ Extract param correctly (must match folder name)
  const esevaid = params.esevaid

  try {
    const subadmins = await db.EsevaSubAdmin.findMany({
      where: {
        esevaId: esevaid,
      },
      include: {
        eseva: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return <SubAdminList subadmins={subadmins} esevaId={esevaid} />
  } catch (error) {
    return <div>Error loading subadmins</div>
  }
}

export default SubAdminPage
