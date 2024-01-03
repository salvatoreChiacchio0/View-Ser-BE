import { Injectable } from '@nestjs/common';
import { CheckScheduleDto } from 'src/schedule/entity/check-schedule.dto';

@Injectable()
export class ViewSerializabilityService {
 
  constructor( 
  ) {}
    /**
        1. No transaction reads or writes the same element twice
           and no transaction reads an element that it has written
     */

    checkDuplicates(schedule:string){
        let result = true
        schedule = this.sanitizeSchedule(schedule)
        const transactions:string[] = this.getTransactions(schedule)
        const arrayofTransactionString = [...this.getTransactionsString(transactions, schedule).values()]
        arrayofTransactionString.forEach(transaction =>{
            if(transaction.length !=  new Set(transaction).size) result = false
        })     
        return result
    }

  validatedRegex(schedule: string) {
    let flag = true
    const pattern = /^[rw]\d\((?![rRwW0-9])[a-zA-Z]\)$/;
    const splittedSchedule = schedule.match(/.{1,5}/g)
    splittedSchedule.forEach((str) => {                
      if(!pattern.test(str)) flag = false
     }); 
     return flag
  }

  sanitizeSchedule(schedule:string):string{
    return schedule.trim().replaceAll(' ','').replaceAll(',','').replaceAll('.','').replaceAll(';','').toLowerCase()
  }

  //test for schedule
  
  public  checkSchedule(schedule: string):CheckScheduleDto {    
    let flag = true
    const elements: any[] = this.getDatabaseElement(schedule)
    const transactions: string[] = this.getTransactions(schedule)
    const finalWrites = this.finalWrite(elements, this.getOnlyWriteAction(schedule))
    const readFromSchedule_S = this.getMapOfReadsFrom(elements, schedule)
    
    const arrayOfReadsFrom = [...readFromSchedule_S.entries()]
    const generatedSerialSchedules: string[] = this.getSerialSchedule(transactions, schedule, arrayOfReadsFrom)
    
    if (generatedSerialSchedules.length == 0) flag = false

    const serialFinalWrite = this.generatedSerialScheduleFW(generatedSerialSchedules, elements)
    const viewEqSchedulesByFW = this.getSerialScheduleByFW(serialFinalWrite, finalWrites, generatedSerialSchedules)
    const viewEqSchedules = this.checkReadFromViewEqSchedules(elements,viewEqSchedulesByFW,readFromSchedule_S)
    
    if (viewEqSchedules.length == 0) flag = false


    return this.getResponseObject(schedule, viewEqSchedules, finalWrites, arrayOfReadsFrom, transactions,flag)
}

checkReadFromViewEqSchedules(elements,generatedSerialSchedules:string[],mapOfReadFromInputSchedule:Map<any,any>):string[]{
    return generatedSerialSchedules.filter((schedule:string)=>{        
        if(this.mapsAreEqual(this.getMapOfReadsFrom(elements,schedule),mapOfReadFromInputSchedule)) return schedule   
    }) 
}

getResponseObject(schedule: string, ViewEqS: string[], finalWrites: Map<any, any>, readFromArray: number[][], transactions: string[],result:boolean) {
    const finalWriteString: string = [...finalWrites.entries()].map((data) => { return 'w' + data[1] + '(' + data[0] + ')' }).join(' - ')
    return{
        schedule: schedule,
        viewEquivalentSchedule: ViewEqS,
        finalWrite: finalWriteString,
        readFrom: readFromArray.length > 0 ? readFromArray.map((elem) => { return  'T' + elem[0] + " ➡️ " + 'T' + elem[1] }).join(" - ") : 'No read from',
        viewEquivalentTransaction:  ViewEqS.length>0 ?  ViewEqS.map((elem) => { return 'T' + this.getTransactions(elem).join(" T") }).join(' - '): "No view equivalent transaction",
        transactions: [...this.getTransactionsString(transactions, schedule).values()].join(" - ").replaceAll(',', ''),
        result: result
      }
}

getSerialScheduleByFW(serialFinalWrite: Map<any, any>[], finalWrites: Map<any, any>, generatedSerialSchedules: string[]) {
    let viewEquivalentSchedules: string[] = []

    serialFinalWrite.filter((schedule: any, index: number) => {
        if (this.mapsAreEqual(schedule, finalWrites)) return viewEquivalentSchedules.push(generatedSerialSchedules[index])
    })
    return viewEquivalentSchedules
}


mapsAreEqual(m1: Map<any, any>, m2: Map<any, any>) {
    return m1.size === m2.size &&
        Array.from(m1.keys()).every((key) => m1.get(key) === m2.get(key))
};


getSerialSchedule(transactions: string[], schedule: string, arrayOfReadsFrom: number[][]): string[] {
    // create a map with key the transaction number and value the action of the transaction
    let tran = this.getTransactionsString(transactions, schedule)
    /* create all possible random combination where transaction.map(Number)
       return an array with the number inside transaction (without duplicates)  
    */
    let tCombination = this.heapPermutation(transactions.map(Number),transactions.map(Number).length)
    
    // first shrinking process 
    tCombination = this.getScheduleRespectingReadFromRelation(tCombination, arrayOfReadsFrom)

    //generate the serial string of transaction combination that "passed" the first shrinking phase
    return this.createSerialSchedule(tran, tCombination)
}


getTransactionsString(transactions: string[], schedule: string): Map<number, string[]> {
    const result = schedule.match(/.{1,5}/g);
    let newSchedule = result !== null ? Array.from(result) : [];
    let tran = new Map<number, string[]>()
    transactions.forEach((el) => {
        tran.set(parseInt(el), newSchedule.filter((element) => {
            if (element[1] == el) return element
        }))
    })
    return tran
}


generatedSerialScheduleFW(generatedSerialSchedules: string[], elements: string[]) {
    return generatedSerialSchedules.map((schedule: string) => {
        return this.finalWrite(elements, this.getOnlyWriteAction(schedule))
    })
}


getScheduleRespectingReadFromRelation(allSerialSchedules: number[][], arrayOfReadsFrom: number[][]) {    
    return allSerialSchedules.filter((schedule: number[]) => {
        return arrayOfReadsFrom.every((x: number[]) => {
            if (schedule.indexOf(Number(x[0])) > schedule.indexOf(Number(x[1]))) return schedule
        });
    })
}

createSerialSchedule(transactionMap: any, serialSchedules: number[][]) {
    return serialSchedules.map((schedule: number[]) => {
        let serialSchedule: string = "";
        schedule.forEach((transaction: number) => {
            serialSchedule += [...transactionMap.get(transaction)].join('').replaceAll(" ", '')
        })
        return serialSchedule
    })
}

getMapOfReadsFrom(elements: string[], schedule: string): Map<any, any> {
    let arr: Map<string, string>[] = []
    elements.map((element: string) => {
        arr.push(this.getReadsFromByElements(this.getActionsByElement(element, schedule)))
    })
    return new Map(arr.reduce((r, map) => new Map([...r, ...map]), new Map()));
}

// getTransactionCombination(list:any): number[][] {
//     var shufflings = [];
//     while (true) {
//         var clone = list.slice();
//         var shuffling = [];
//         var period = 1;
//         while (clone.length) {
//             var index:any = Math.floor(shufflings.length / period) % clone.length;
//             period *= clone.length;
//             shuffling.push(clone.splice(index, 1)[0]);
//         }
//         shufflings.push(shuffling);
//         if (shufflings.length == period) return shufflings;
//     }
// }

heapPermutation(array: number[], size: number): number[][] {    
    const result: number[][] = [];
  
    function generatePermutations(currentSize: number): void {
      if (currentSize === 1) {
        result.push([...array]);
        return;
      }
  
      for (let i = 0; i < currentSize; i++) {
        generatePermutations(currentSize - 1);
  
        if (currentSize % 2 === 0) {
          [array[currentSize - 1], array[i]] = [array[i], array[currentSize - 1]];
        } else {
          [array[currentSize - 1], array[0]] = [array[0], array[currentSize - 1]];
        }
      }
    }
  
    generatePermutations(size);
    return result;
  }
getDatabaseElement(schedule: string) {
    const result = schedule.match(/.{1,5}/g);

    let arrayOfActions = result !== null ? Array.from(result) : [];
    let elements = arrayOfActions.map(action => action.match(/\(([^)]+)\)/)?.[1])
    return Array.from(new Set(elements))
}

getTransactions(schedule: string): string[] {
    const result = schedule.match(/.{1,5}/g);

    let arrayOfActions = result !== null ? Array.from(result) : [];
    arrayOfActions = arrayOfActions.map((action) => { return action[1] })
    return Array.from(new Set(arrayOfActions))
}

finalWrite(elements: string[], schedule: string) {
    const map = new Map()
    elements.forEach((element: string) => {
        map.set(element, schedule[schedule.lastIndexOf(element) - 2])
    })    
    return map
}

getOnlyWriteAction(schedule: string) {
    const result = schedule.match(/.{1,5}/g);

    let arrayOfWrites = result !== null ? Array.from(result) : [];      
      arrayOfWrites = arrayOfWrites.filter((action: string) => { if (action[0] == 'w') return action })
    return arrayOfWrites.join()
}

getActionsByElement(element: string, schedule: string) {
    const result = schedule.match(/.{1,5}/g);
    let op = result !== null ? Array.from(result) : [];  
    op = op.filter((action: string) => { if (action.match(/\(([^)]+)\)/)?.[1].toLocaleString() == element) return action })
    return op
}

getReadsFromByElements( actionsByElem: string[]) {
    let map = new Map();
    actionsByElem.forEach((action: string, index: number) => {
         if (action[0] === 'w') {
            for (let index2 = index + 1; index2 < actionsByElem.length; index2++) {
                const elemToRead = actionsByElem[index2];
                 if (elemToRead[0].includes('w')) break;  
                if (action[1] !== elemToRead[1] ) map.set(elemToRead[1], action[1]);
            }
        }
    });
    return map;
}   

    //not used -> checks conflict 
    getConflictingAction( transactionByElem: string[], viewSer:boolean){
            let map = new Map();
            transactionByElem.forEach((action: string, index: number) => {
                if (action[0] === 'w' && viewSer) {
                    for (let index2 = index + 1; index2 < transactionByElem.length; index2++) {
                        const elemToRead = transactionByElem[index2];
                        if (elemToRead[0].includes('w') && viewSer) break;  
                        if (action[1] !== elemToRead[1] ) map.set(elemToRead[1], action[1]);
                    }
                }
            });
            return map;
    }

}

