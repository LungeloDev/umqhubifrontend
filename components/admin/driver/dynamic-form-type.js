export const checkFormType = (data, formFields) => {
    const findField = formFields?.find(d => d?.input_name === data?.key);
    return findField?.input_type
}

export const checkFormTypeByKey = (key, formFields) => {
    const findField = formFields?.find(d => d?.input_name === key);
    return findField?.input_type
}