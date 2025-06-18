/** @format */

import { redirect } from "next/navigation";

const page = () => {
  // redirect
  redirect("/admin");
  return <div>page</div>;
};

export default page;
