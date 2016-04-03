import {Pipe} from 'angular2/core';

@Pipe({
  name: 'remoteOperationsOnly'
})
export class RemoteOperationsOnly {
  transform(arr: Object[]): Array<Object> {
    return arr.filter((element) => {
        return element['_remoteExecution'] === "true";
    });
  }
}