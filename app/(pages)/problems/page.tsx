import { Suspense } from "react";
import Headline from "../../_components/ui/Headline";
import { AllCategoriesSkeleton } from "../categories/_components/AllCategories";
import AllProblems from "./_components/AllProblems";

const ProblemsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  return (
    <>
      <Headline level={1}>Lista problema</Headline>

      <Suspense fallback={<AllCategoriesSkeleton />}>
        <AllProblems searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default ProblemsPage;
