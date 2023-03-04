onmessage = ({ data }) => {
    console.log('Video Player Worker: ', data);

    postMessage({
        response: 'ok',
    });
};
