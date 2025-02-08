/* eslint-disable @typescript-eslint/no-explicit-any */
import ItemOperationsButtons from "@/app/_components/dataOperations/ItemOperationsButtons";
import BackButton from "@/app/_components/ui/Buttons/BackButton";
import Headline from "@/app/_components/ui/Headline";
import Map from "@/app/_components/ui/Map";
import Picture from "@/app/_components/ui/Picture";
import { getProblemById } from "@/app/_utils/api_utils/problems";
import { convertLatLngToString, formatDate } from "@/app/_utils/helpers/";
import { statuses } from "../_components/FilterOptions";

const ProblemPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const problem = await getProblemById((await params).id);

  const isReported = problem?.officialEmail === "1";
  return (
    <>
      <BackButton />

      <Headline level={1}>{problem?.title}</Headline>
      {isReported && (
        <p className="bg-danger-200/80 py-3 px-4 mb-2">
          Problem je zvanično prijavljen nadležnim službama. Nisu dozvoljene
          naknadne izmene osim izmene statusa problema.
        </p>
      )}
      {problem?.status === "archive" && (
        <p className="bg-danger-200/80 py-3 px-4 mb-2">
          Problem je ariviran (obrisan) od strane korisnika.
        </p>
      )}
      {problem?.status === "waiting" && (
        <p className="bg-blue-200/80 text-primary-900 py-3 px-4 mb-2">
          Problem čeka na odobrenje za prikazivanje.
        </p>
      )}
      <div className="mt-4 w-full 2xl:w-2/3">
        <div className="grid grid-col-1 lg:grid-cols-2 gap-4 items-start mb-4">
          {/* Left part */}
          <div className="space-y-1">
            <p className="border-b border-secondary-100/30 pb-3">
              {problem?.description}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] items-center gap-[3px] border-b border-secondary-100/30 py-3">
              Korisnik:
              <p>
                {problem?.user.firstname} {problem?.user.lastname}
              </p>
              Datum prijave:
              <p>
                {problem?.createdAt &&
                  formatDate(problem?.createdAt.toString())}
              </p>
              {problem?.updatedAt && (
                <>
                  Datum rešavanja:
                  <p>
                    {problem?.updatedAt &&
                      formatDate(problem?.updatedAt.toString())}
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] items-center gap-[3px]  border-b border-secondary-100/30 py-3">
              Kategorija:
              <p>{problem?.category?.cat_name}</p>
              Status:
              {statuses
                .filter((s) => s.value === problem?.status)
                .map((s) => (
                  <p key={s.value}>{s.label}</p>
                ))}
            </div>

            <Picture
              src={problem?.image || ""}
              alt={problem?.title || ""}
              className="!h-[300px] !w-full"
            />
          </div>

          {/* right part */}
          <div>
            <p>
              {convertLatLngToString(
                problem?.position as { lat: number; lng: number }
              )}
            </p>
            <Map
              defaultPosition={
                problem?.position as { lat: number; lng: number }
              }
              initialZoom={16}
            />
            {problem?.status !== "archive" && (
              <ItemOperationsButtons
                id={problem?.id as string}
                basePath="problems"
              />
            )}
          </div>
        </div>{" "}
      </div>
    </>
  );
};

export default ProblemPage;
