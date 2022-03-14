// windows section

function windowCosine(bufferSize) {
    let windowValues = []
    for (let i = 0; i < bufferSize; i++) {
        windowValues[i] = Math.sin(Math.PI / 1024 * (i + 0.5));
    }
    return windowValues;
}

// utils section

function centerPad(data, framelength) {
    let zerosArray = Array(framelength / 2).fill(0);
    return zerosArray.concat(data).concat(zerosArray)
}

function zeroPad(data, framelength) {
    while (data.length % framelength !== 0) {
        data.push(0);
    }
    return data;
}

function processSpectrogram(signalChunk, framelength) {
    let data = math.dotMultiply(signalChunk, windowCosine(framelength));
    return mclt(data);
}

// Spectrogram section

function spectrogramMCLT(data, framelength = 1024, centered = true) {
    let outlength = data.length;
    let overlap = 2;
    let hopsize = framelength / overlap;
    let signal = data;

    if (centered) {
        signal = centerPad(signal, framelength);
    }
    signal = zeroPad(signal, framelength);

    let values = [];
    for (let chunk = 0; chunk <= signal.length / hopsize - 1; chunk++) {
        values.push(processSpectrogram(signal.slice(chunk * hopsize, (chunk * hopsize) + framelength), framelength));
    }

    return values;
}

// transformation section

function mclt(x, odd = true) {
    let N = Math.floor(x.length / 2);
    let n0 = (N + 1) / 2;
    let pre_twiddle = [];
    let offset;
    let outlen;
    if (odd) {
        outlen = N;
        for (let i = 0; i < N * 2; i++) {
            pre_twiddle.push(math.exp(math.complex(0, -1 * math.pi * i / (N * 2))));
        }
        offset = 0.5;
    } else {
        outlen = N + 1;
        pre_twiddle = 1.0;
        offset = 0.0;
    }
    let post_twiddle = [];
    for (let i = 0; i < outlen; i++) {
        post_twiddle.push(math.exp(math.complex(0, -1 * math.pi * n0 * (i + offset) / N)));
    }

    let X = []
    let aux_mul = math.dotMultiply(x, pre_twiddle);
    for (let k = 0; k < N * 2; k++) {
        let aux_mul2 = -2 * math.pi * k / (N * 2);
        X[k] = []
        for (let ii = 0; ii < N * 2; ii++) {
            X[k].push(math.dotMultiply(aux_mul[ii], math.exp(math.complex(0, aux_mul2 * ii))))
        }
        X[k] = X[k].reduce((a, b) => math.add(a, b));
    }

    if (!odd) {
        X[0] *= math.sqrt(0.5);
        X[X.length - 1] *= math.sqrt(0.5);
    }

    return math.dotMultiply(math.dotMultiply(X.slice(0, X.length / 2), post_twiddle), math.sqrt(1 / N));
}

// example

function example(sampleDataSize=2048) {
    let sampleData = []
    for (let i = 0; i < sampleDataSize; i++) {
        sampleData.push(i)
    }

    return spectrogramMCLT(sampleData)
}