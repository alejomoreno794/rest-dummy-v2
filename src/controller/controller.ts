import { Request, Response } from 'express';
const fs = require('fs');
const path = require('path')
let routesFile = path.join(process.cwd(), '/src/routes/routes.ts');


const createDummy = async (req: Request, res: Response) =>{
    const body = req.body;
    console.log(body);
    let method = body.method;
    let path = body.path;
    let data = body.data;
    let status = body.status;
    const allFileContents = fs.readFileSync(routesFile, 'utf-8');
    let content = "";
    let controllerNumber=0;
    allFileContents.split(/\r?\n/).forEach((line:any) =>  {
        if(line.includes("#Controllers-line")) {
            controllerNumber = calculateControllerVersion(line);
            content+=setControllerVersion(controllerNumber);
            content+=addControllerImport(method,controllerNumber);
            content+="\n";
        } else if(line.includes("#Routes-line")){
            content+=line+"\n";
            content+=addRouteToRouter(path,method,controllerNumber);
            content+="\n";
        }else {
            content+=line+"\n";
        }
    });
    createControllerFile(controllerNumber,method,data, status);
    fs.writeFileSync(routesFile, content);
    return res.status(200).json({});
}


const createControllerFile = (controller_number:any, prefix:any, source:any, status:any)=>{
    let controller_name = prefix+"_generic_controller_"+controller_number;
    let testFile = path.join(process.cwd(), '/src/controller/'+controller_name+".ts");
    let createStream = fs.createWriteStream(testFile);
    let content = givenControllerContent(prefix, controller_number,source, status);
    createStream.write(content);
    createStream.end();

}

const givenControllerContent = (prefix:any, controllerNumber:any, source:any, status:any) => {
    let content ="import pre_loaded_data from \"../pre-loaded-data/"+source+"\""+"\n"
                 +"import { Request, Response } from 'express';"+"\n\n\n"
                 +"const "+prefix+"Controller"+controllerNumber+" = async (req: Request, res:Response) =>{"+"\n"
                 +"   let answer:any = pre_loaded_data;"+"\n"
                 +"   return res.status("+status+").json(answer);"+"\n"
                +"}"+"\n\n\n"
                +"export {"+prefix+"Controller"+controllerNumber+"}";
    return content;
}

const addControllerImport = (prefix:any, controllerNumber:any) =>{
    return "import {"+prefix+"Controller"+controllerNumber+"} from \"../controller/"+prefix+"_generic_controller_"+controllerNumber+"\""
}

const addRouteToRouter = (route:any,prefix:any, controllerNumber:any) => {
    return "router."+prefix.toLowerCase()+"(\""+route+"\","+prefix+"Controller"+controllerNumber+");";
}

const calculateControllerVersion = (line:any) => {
    let controllerNumber = Number(line.split(" ")[1]);
    return controllerNumber+1;
}

const setControllerVersion = (controllerNumber:any) =>{
    return "\/\/#Controllers-line "+controllerNumber+"\n";
}

export {createDummy}