type RouteAccessMap = {
    [key: string]: string[];
  };

  export const routeAccessMap: RouteAccessMap = {
    "/(.*)":["admin"],
    "/list/appointments(.*)": ["admin", "staff"], 
    "/list/admissions(.*)": ["admin", "staff"], 
    "/list/patients(.*)": ["admin", "staff"],  
    "/list/services(.*)": ["admin"],   
    "/list/services/surgery(.*)": ["admin"],  
    "/list/payments(.*)":['admin','staff'],
    "/finance(.*)": ["admin"],  
    "/list/hospital(.*)": ["admin", "staff"],  
    "/list/beds(.*)": ["admin"],  
    "/pharmacy-dashboard": ["admin", "pharma"], 
    "/inventory(.*)": ["admin", "pharma"],  
    "/list/medicine(.*)": ["admin", "pharma"],  
};
