type RouteAccessMap = {
    [key: string]: string[];
  };

  export const routeAccessMap: RouteAccessMap = {
    "/list/appointments(.*)": ["admin", "staff"], 
    "/list/patients(.*)": ["admin", "staff"],  
    "/list/staff(.*)": ["admin"],  
    "/list/services(.*)": ["admin"],   
    "/list/services/surgery(.*)": ["admin"],  
    "/finance(.*)": ["admin"],  
    "/list/hospital(.*)": ["admin", "staff"],  
    "/list/beds(.*)": ["admin", "staff"],  
    "/pharmacy-dashboard": ["admin", "pharma"], 
    "/inventory(.*)": ["admin", "pharma"],  
    "/list/medicine(.*)": ["admin", "pharma"],  
};
