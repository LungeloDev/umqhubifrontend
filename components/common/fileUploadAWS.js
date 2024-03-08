import {postFileToAws} from "../../helpers/backend_helper";

const awsFileUpload = async (files, callBack) => {
    if(typeof files === "string") {
        return files
    }
    if(!files) return;
    try {
        const data = new FormData()
        data.append('file', files);

        const url = await postFileToAws(data);
        if (url?.error === false) {
            return url?.data?.length === 1 ? url?.data[0] : url?.data ;
        }
        return undefined;
    } catch (e) {
        return e.message;
    }
}

const getAwsUploadImagesUrl = async images => {
    if (images?.length > 0) {
        let urls = []
        for (let i = 0; i < images?.length; i++) {
            if (+images[i].uid < 0) {
                urls.push( images[i].url)
            } else {
                let {originFileObj} = images[i]
                let url = await awsFileUpload(originFileObj)
                urls.push(url)
            }
        }
        return urls;
    }
    return []
}

const getAwsUploadSingleImageUrl = async images => {
    if (images?.length > 0) {
        for (let i = 0; i < images?.length; i++) {
            if (+images[i].uid < 0) {
                return images[i].url
            } else {
                let {originFileObj} = images[i]
                return await awsFileUpload(originFileObj)

            }
        }
    }
    return ''
}

export {
    awsFileUpload,
    getAwsUploadImagesUrl,
    getAwsUploadSingleImageUrl
}