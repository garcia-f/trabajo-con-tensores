const matrix = [];

for (let i = 0; i < 10; i++) {
    let row = []
    for (let j = 0; j < 10; j++) {
        if (j + 1 == 10) {
            row.push(1)
        } else {
            row.push(j + 1)
        }
    }
    matrix.push(row)
}

const finalAmount = 1

async function memoryVerify() {
    const bytesMaxSize = finalAmount * 1024 * 1024;

    let tensor1 = tf.tensor2d(matrix);
    let tensor2 = tf.tensor2d(matrix);
    let finalTensor = tf.tensor2d(matrix);

    let firstTensor = true

    const memoryElement = document.getElementById('memory');

    while (true) {
        if (firstTensor) {
            finalTensor = finalTensor.mul(tensor1)
            tensor1 = tensor1.mul(tensor2)
        } else {
            finalTensor = finalTensor.mul(tensor2)
            tensor2 = tensor1.mul(tensor1)
        }

        const tensorMemory = tf.memory();
        const memoryInMB = tensorMemory.numBytes / (1024 * 1024);
        const consoleMsg = `Uso de memoria: ${memoryInMB.toFixed(2)} MB`;
        console.log(consoleMsg);

        memoryElement.innerHTML = consoleMsg;

        if (tensorMemory.numBytes > bytesMaxSize) {
            memoryElement.innerHTML += `<br>Límite de ${finalAmount}MB alcanzado.`;
            console.log(`Límite de ${finalAmount}MB alcanzado.`);
            document.getElementById('finalTensor').innerHTML = finalTensor.toString();
            finalTensor.print()
            tensor1.dispose();
            tensor2.dispose();
            finalTensor.dispose();
            break;
        }

        firstTensor = !firstTensor;
        // para limitar el tiempo de ejecución
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}

memoryVerify();