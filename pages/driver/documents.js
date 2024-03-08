import Head from 'next/head';
import React from 'react';
import Card from '../../components/common/card';
import DriverLayout from '../../layouts/driver';
import {useFetch} from '../../helpers/hooks';
import {fetchFormFields, fetchVehiclesDriverWise} from '../../helpers/backend_helper';
import {useI18n} from '../../contexts/i18n';
import {checkFormTypeByKey} from '../../components/admin/driver/dynamic-form-type';
import {useUserContext} from '../../contexts/user';
import {useRouter} from 'next/router';

const Document = () => {
    const i18n = useI18n();
    const [vehicles, getVehicles] = useFetch(fetchVehiclesDriverWise)
    const [formFields, getFormFields, {loading, error}] = useFetch(fetchFormFields);
    const {push, query} = useRouter()
    const {_id} = useUserContext()
    // reform the document 
    const documentResult = [];
    if (vehicles?.documents) {
        const driverInformations = Object?.values(
            vehicles?.documents || {}
        );

        const driverInformationsKey = Object?.keys(
            vehicles?.documents || {}
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
            <Head>
                <title>Documents</title>
            </Head>

            <div>
                <Card>
                    <div className='flex justify-between items-center'>
                        <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Documents")}</h1>
                        <button
                            onClick={() => push("/driver/documents-edit?driver=" + _id)}
                            className='px-4 py-2 bg-twSecondary-shade700 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>{!!i18n && i18n?.t("Update Documents")}</button>
                    </div>

                </Card >

                <Card className={'shadow-sm text-font_color font-semibold'}>
                    {documentResult.length > 0 ?
                        <div className="max-w-[900px] mb-20 h-auto text-twContent text-base p-2 mt-2  mx-auto border-2 border-twPrimary shadow-sm">
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
                        :
                        <p className='text-gray-600 text-[16px] font-semibold tracking-wider'>Documents are not available</p>
                    }
                </Card>
            </div >
        </div >
    );
};

Document.layout = DriverLayout
export default Document;