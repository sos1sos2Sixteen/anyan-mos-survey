


const Overlay = {
    loading: 0,
    succ: 1,
    hidden: 2,
    error: 3,
    login: 4,
};


const Page = {
    todo : 0,
    done : 1
};

const Response_type = {
    MOS : 0
};

function response_to_enum  (resp_str) {
    return {
        "MOS" : Response_type.MOS
    }[resp_str]
}

const INVALID_SCORE = "INVALID"

export {
    Overlay,
    Page,
    Response_type,
    response_to_enum,
    INVALID_SCORE
}