import {UrlSerializer, UrlTree, DefaultUrlSerializer} from '@angular/router';

export class CustomSerializer implements UrlSerializer {
  parse(url: any): UrlTree {
    const dus = new DefaultUrlSerializer();
    // url = url.replace('(', '%28')
    //  .replace(')', '%29');
    return dus.parse(url);
  }

  serialize(tree: UrlTree): any {
    const dus = new DefaultUrlSerializer();
    const path = dus.serialize(tree);
    // use your regex to replace as per your requirement.
    return path
      // .replace(/%28/g, '(')
      // .replace(/%29/g, ')');
    ;
  }
}
