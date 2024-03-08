import { useRouter } from "next/router";
import { useEffect } from "react";
import { checkFormTypeByKey } from "../../../../components/admin/driver/dynamic-form-type";
import Card from "../../../../components/common/card";
import { useI18n } from "../../../../contexts/i18n";
import { fetchDriverVehicle, fetchFormFields } from "../../../../helpers/backend_helper";
import { useFetch } from "../../../../helpers/hooks";
import AdminLayout from "../../../../layouts/admin";

const Documents = () => {
    const i18n = useI18n()
    const { query } = useRouter();
    const [document, getDocument] = useFetch(fetchDriverVehicle, {}, false)

    const [formFields, getFormFields, { loading, error }] = useFetch(fetchFormFields);

    useEffect(() => {
        if (!!query?._id) {
            getDocument({ _id: query?._id });
        }
    }, [query?._id]);

    // driver my-vehicle filtering from object
    const documentResult = [];
    if (document?._id) {
        const driverInformations = Object?.values(
            document?.documents || {}
        );
        const driverInformationsKey = Object?.keys(
            document?.documents || {}
        );
        for (let i = 0; i < driverInformations.length; i++) {
            documentResult.push({
                document_key: driverInformationsKey[i],
                document_value: driverInformations[i],
            });
        }
    }

    return (
        <div>
            <Card className={'shadow-sm text-font_color font-semibold'}>
                <h1 className=''>
                    {!!i18n && i18n.t("Driver Documents")}
                </h1>
            </Card>
            <Card className={'shadow-sm text-font_color font-semibold'}>
                <div
                    className="max-w-[900px] mb-20 h-auto text-twContent text-base p-2 mt-2  mx-auto border-2 border-twPrimary shadow-sm">
                    {documentResult?.map((document, i) => (
                        <div
                            key={document?.document_key}
                            className={`grid md:grid-cols-3 ${i !== 0 ? " border-t" : " "} py-[16px] px-2 ${checkFormTypeByKey(document?.document_value?.key, formFields) === "image" ? "grid-cols-1 " : "grid-cols-2 "}`}
                        >
                            <p className="capitalize">{document?.document_value?.key?.split("_").join(" ")}</p>
                            <p className="md:col-span-2 ">
                                {checkFormTypeByKey(document?.document_value?.key, formFields) === "image" ? (
                                    <img
                                        className="md:col-span-2 md:h-[150px] md:w-fit w-full md:duration-500 md:hover:scale-[2]"
                                        src={document?.document_value?.value}
                                    ></img>
                                ) : (
                                    document?.document_value.value
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
Documents.layout = AdminLayout
export default Documents;