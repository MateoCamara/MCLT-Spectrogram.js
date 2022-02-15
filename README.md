# MCLT-Spectrogram.js
Spectrogram based on the Modulated Complex Lapped Transform in Javascript

## Explanation

This module is intended to be used in the browser. The development has been based on the python modules mdct for the development of the MCLT transformation and scipy for the development of the FFT and spectrogram.

A function called spectrogramMCLT is provided to which the data, the framelength and whether to center the transformation can be passed. The overlap is fixed to 2 and in general, it is not tested for framelengths other than 1024 points.

The result is a complex array of numbers representing MCLT Spectrogram.

This code is under active development.