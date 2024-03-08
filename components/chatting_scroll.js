import React from 'react'

const useChatScroll = (dep) => {
    const ref = React.useRef();
    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dep]);
    return ref;
}

export default useChatScroll