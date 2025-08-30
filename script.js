// arr = [10,20,30,40,50];
// let j = arr.length
// let temp = 0
// for(let i = 0; i<arr.length/2;i++){
//     temp = arr[i]
//     arr[i] = arr[j];
//     arr[j] = temp ; 
//     j-- 
// }
// console.log(arr);

let arr = [0,1,0,0,1];

let j = 0;
let i = 0;

while(i<arr.length){
    if( arr[i] == 0 ){
        let temp = 0;
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++;
        j++;
    }
    i++;
}
console.log(arr);


