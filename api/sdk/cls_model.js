const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    x1 = (data[0] - 42.773) / 10.33017
    x2 = (data[1] - 29.9412) / 8.936247
    x3 = (data[2] - 94.8964) / 8.887377
    y1 = (data[3] - 32.2718) / 16.08198
    y2 = (data[4] - 39.959) / 8.918815
    y3 = (data[5] - 69.739) / 11.79956
    return [x1, x2, x3, y1, y2, y3]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el,idx]).reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min))

function ArgMax(res){
  label = "NORMAL"
  cls_data = []
  for(i=0; i<res.length; i++){
      cls_data[i] = res[i]
  }
  console.log(cls_data, argMax(cls_data));
    
  if(argMax(cls_data) == 1){
    label = "OVER VOLTAGE"
  }if(argMax(cls_data) == 0){
    label = "DROP VOLTAGE"
  }
  return label
}

async function classify(data){
    let in_dim = 6; // x1 x2 x3 y1 y2 y3
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/muzahdi/jst-muzahdi/main/public/cls_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return ArgMax( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    classify: classify 
}
