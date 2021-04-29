


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
    MOS : 0,
    ABX : 1
};

function response_to_enum  (resp_str) {
    /**
     * convert resposne type string from server to the above enum, probabily should be implemented 
     * with some sort of reflection but i'm to lazy to dig into js for this.
     * manually sync with `Response_type` should be fine
     */
    return {
        "MOS" : Response_type.MOS,
        "ABX" : Response_type.ABX
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