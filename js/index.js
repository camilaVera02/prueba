const { ApolloServer } = require('@apollo/server')


const { startStandaloneServer } = require('@apollo/server/standalone')


//creación de objetos MATERIA, RESUMEN, VIDEO, BIBLIOGRAFIA y QUERY para obtener las materias /*eliminamos -->  parcial: String!*/
const typeDefs = `#graphql


type Materia {
  id: ID!
  nombre: String!
  resumenes: [Resumen!]!
  videos: [Video!]
  bibliografia: [Bibliografia!]
}
 
type Resumen {
  id: ID!
  titulo: String!
  pdfUrl: String!
}

type Video {
  id: ID!
  titulo: String!
  url: String!
}


  type  Bibliografia{
  id: ID!
  titulo:String!
  autor:String!
  editorial:String!
  }


type Query {

  materias: [Materia!]!
  materiaPorId(id: ID!): Materia
}
`

//Datos en Memoria
const materias = [

  { 
    id: "BDD1",
    nombre: "Base de Datos 1",
    resumenes: ["R03", "R04"],
    videos: ["V07", "V08", "V09", "V10", "V11", "V12", "V13"],
    bibliografia:[]
  },
  {id: "AC1",
    nombre: "Arquitectura de Computadoras 1",
    resumenes: ["R05", "R06"],
    videos: ["V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28", "V29"],
    bibliografia:[]

  },{
    id: "REDES1",
    nombre: "Comunicación y Redes 1",
    resumenes: ["R01", "R02"],
    videos: ["V01", "V02", "V03", "V04", "V05", "V06"],
    bibliografia:[]
  },{
    id: "ING1",
    nombre: "Ingeniería de Software 1",
    resumenes: ["R11", "R12"],
    videos: ["V36", "V37", "V38", "V39", "V40", "V41", "V42"],
    bibliografia:["B01", "B02", "B03"]
  },
  {
    id: "AC2",
    nombre: "Arquitectura de Computadoras 2",
    resumenes: ["R07", "R08"],
    videos: ["V30", "V31", "V32", "V33", "V34", "V35"],
    bibliografia:[]
  },
  {
    id: "SO1",
    nombre: "Sistemas Operativos 1",
    resumenes: ["R09", "R10"],
    videos: ["V14", "V15", "V16", "V17", "V18", "V19", "V20", "V21"],
    bibliografia:[]
  }]
//------------------------------------RESUMENES----------------------------------------------------------------
  const resumenes = [
    //Redes
{
    id: "R01",
        titulo: "Parte 1",
        pdfUrl: "https://drive.google.com/file/d/1O2PoqmJoVZc_2llUDsJH8XdXoJ6vTrX8/view?usp=drive_link"
},
{
    id: "R02",
        titulo: "Parte 2",
        pdfUrl: "https://drive.google.com/file/d/1fv2-M_vL9lRBS1-EQmuwhdnSlDtmfHD2/view?usp=drive_link"
},
//base de datos
{
    id: "R03",
        titulo: "Parte 1",
        pdfUrl: "https://drive.google.com/file/d/1H9suioMZMMxVxzEua8VEUxx7gQWhOG_h/view?usp=drive_link"
},
{
    id: "R04",
        titulo: "Parte 2",
        pdfUrl: "https://drive.google.com/file/d/1cmHWgNQMerV8TDv5cwsOPQA67rNtYBe-/view?usp=drive_link"
},
//ARQUI 1
{
    id: "R05",
        titulo: "Parte 1",
        pdfUrl: "---"
},
{
    id: "R06",
        titulo: "Parte 2",
        pdfUrl: "---"
},
//ARQUI2
{
    id: "R07",
        titulo: "Parte 1",
        pdfUrl: "https://drive.google.com/file/d/14bUuiQIzdXPKmMcWo_5-J5FnaeOFLDCA/view?usp=drive_link"
},{
    id: "R08",
        titulo: "Parte 2",
        pdfUrl: "https://drive.google.com/file/d/1Xe8n_RRMuf2HRuJbOokq7TAmk-0VX5pJ/view?usp=drive_link"
},
//SO1
{
    id: "R09",
        titulo: "Parte 1",
        pdfUrl: "https://drive.google.com/file/d/15ie-kXk7FlPLEoCmrVFrV0aMhX98cIpu/view?usp=drive_link"
},{
    id: "R10",
        titulo: "Parte 2",
        pdfUrl: "https://drive.google.com/file/d/1ir2wqPAERLZUDMpuXJ_1M3K7iC3V0OWL/view?usp=drive_link"
}, //NG1
{
    id: "R11",
        titulo: "Parte 1",
        pdfUrl: "---"
},{
    id: "R12",
        titulo: "Parte 2",
        pdfUrl: "---"
}
  ]
  
//---------------------------VIDEOS----------------------------

//VIDEOS DE REDES 1
const VideosRedes=[
  {
        id: "V01",
        titulo: "Medios de Transmisión 1",  
        url: "https://youtu.be/V17j6i8p_J4?si=d5vWlBIZETGmUs4G"
      }  ,
       {
        id: "V02",
        titulo: "Medios de Transmisión 2",  
        url: "https://youtu.be/0WJ5zVzc3ZM?si=Gf4Tceg_u5Hhh_XP"
      },{
        id: "V03",
        titulo: "Topologías de Red",  
        url: "https://youtu.be/oy_vnFR-nzI?si=lEq00_FyAZxBjiux"
      },{
        id: "V04",
        titulo: "Modelo OSI",  
        url: "https://youtu.be/CnNRdJgeMo8?si=WBvo1ga-qtAlTOet"
      },{
        id: "V05",
        titulo: "tipos de redes",  
        url: "https://youtu.be/l6brkMOJCIo?si=8XTOhpEVuxSUwRpo"
      },{
        id: "V06",
        titulo: "Corrección de errores",  
        url: "https://youtu.be/Wj5ZLtBJ3j8?si=PIoq05xn26Lw83-G"
      }
]               
//VIDEOS DE BASE DE DATOS 1
const VideosBDD1=[
    {
        id: "V07",
        titulo: "Diseños de base de datos",  
        url: "https://youtu.be/m49huH2NHJ8?si=qvOJpw3s7SlLI_P7"
      }, {
        id: "V08",
        titulo: "Algebra Relacional",  
        url: "https://youtu.be/vh0KMMsTGQ0?si=m2ZKneS3JEmdDz7s"
      },{
        id: "V09",
        titulo: "Introducción al diagrama entidad-Relación",  
        url: "https://youtu.be/6fcNDvQYZk0?si=cLHPdQndRms_mSMV"
      },{
        id: "V10",
        titulo: "Introducción al Modelo relacional",  
        url: "https://youtu.be/AOh59KtqrtM?si=7-1BYqnbQs9pl1V_"
      },{
        id: "V11",
        titulo: "Creación de Tablas en SQL",  
        url: "https://youtu.be/yLoh2sSDECw?si=OOWV-m0Kc-ss-sru"
      },{
        id: "V12",
        titulo: "Group by  y Order by",  
        url: "https://youtu.be/eVzmJv2B2wk?si=EG88ow04RUulPGee"
      },{
        id: "V13",
        titulo: "Comandos básicos en SQL",  
        url: "https://youtu.be/D8-PZ7k4VYI?si=Ug85SYBPPom_wD0v"
      }

]

//VIDEOS DE SISTEMAS OPRATIVOS
const VideosSO1=[
    {
        id: "V14",
        titulo: "Introducción a sistemas Operativos",  
        url: "https://youtu.be/fsuroRYmagw?si=NFHs2FMw4luW5CWC"
      },
       {
        id: "V15",
        titulo: "Procesos",  
        url: "https://youtu.be/6P9PQpYb_jk?si=FjIbeqULwq3XFbP-"
      },
       {
        id: "V16",
        titulo: "Llamadas al sistema “calls”",  
        url: "https://youtu.be/tffvKcs83jE?si=kjjGuooZo0tIGWtE"
      }, {
        id: "V17",
        titulo: "Threads",  
        url: "https://youtu.be/JMoM9AliF5E?si=yfTrDQ_wjRbPwwym"
      }, {
        id: "V18",
        titulo: "Administración de memoria",  
        url: "https://youtu.be/et5SCRxqMjM?si=NMM2V_NZeJQX9vID"
      }, {
        id: "V19",
        titulo: "Paginación",  
        url: "https://youtu.be/4R_GcQ_R0tE?si=PakfAGKN8-KdcgbX"
      },{
        id: "V20",
        titulo: "DeadLocks “abrazo de la muerte”",  
        url: "https://youtu.be/JhYPWmh2dWE?si=ZqDGi_ZkIBZvXIaE"
      },{
        id: "V21",
        titulo: "Curso de SO - Algoritmos útiles",  
        url: "https://youtube.com/playlist?list=PLBTcJetyW9aI-109oRxRjQAVy_UwGBWwq&si=sspsxR8yK_yrH8m6"
      }
    ]
 //VIDEOS DE ARQUITECTURA DE COMPUTADORAS 1
const VideosAC1=[
   {
        id: "V21",
        titulo: "Mapas de karnaugh",  
        url: "https://youtu.be/6PRitrviFFM"
      }, {
        id: "V22",
        titulo: "Flip Flops",  
        url: "https://youtu.be/jHbiMWhGPzw?si=-b_bcSBp2vITeZH9"
      }, {
        id: "V23",
        titulo: "compuertas lógicas",  
        url: "https://youtu.be/0TslVzWCIZs?si=r_WzmRLeqJJkJHU3"
      }, {
        id: "V24",
        titulo: " Jerarquía de memorias",  
        url: "https://youtu.be/3eg1ChDL2MU?si=BdbSoE8eo6J87JKv"
      }, {
        id: "V25",
        titulo: "Ciclo de instrucción básico",  
        url: "https://youtu.be/_eUYql5ZcuU?si=4rnh7jVJ6lIUdLy4"
      }, {
        id: "V26",
        titulo: "Von Neumann vs Harvard",  
        url: "https://youtu.be/uPNgjj2a3xE?si=UWsQ-eufsb-hS8D-"
      }, {
        id: "V27",
        titulo: "Organización",  
        url: "https://youtu.be/Laz2jhik9KE?si=OcXLH5kGe9saVTH0"
      }, {
        id: "V28",
        titulo: "Introducción",  
        url: "https://youtu.be/Mzuc7Js5YUc?si=sV-O5EJxBS_iALkt"
      }, {
        id: "V29",
        titulo: "Instrucción básica",  
        url: "https://youtu.be/FtzdL81PgrQ?si=Wa3pjvnxEVQLVqtt"
      }
]

//VIDEOS DE ARQUITECTURA DE COMPUTADORAS 2
const VideosAC2=[
{
        id: "V30",
        titulo: "Introducción",  
        url: "https://youtu.be/-URf73z9tKY?si=o2BLyX6njUjh7AW7"
      },
      {
        id: "V31",
        titulo: "Buses",  
        url: "https://youtu.be/Usy2aY02UaY?si=jUasJUHamaKnw4ph"
      },{
        id: "V32",
        titulo: "Interrupciones",  
        url: "https://youtu.be/uOkpknItDEI?si=Fuy_DFaJDek9OcR5"
      },{
        id: "V33",
        titulo: "Interrupciones",  
        url: "https://youtu.be/APcRnkFqEbQ?si=JgU3Hb2wiSGfiaxX"
      },{
        id: "V34",
        titulo: "ALU",  
        url: "https://youtu.be/FdHKxY4MTW8?si=HwKkTZSXTJwYNNes"
      },{
        id: "V35",
        titulo: "Caché",  
        url: "https://youtu.be/ZlvobYFlstM?si=cFyKCUr973z70k1p"
      }
    ]

//VIDEOS DE INGENIERÍA DE SOFTWARE 1
const VideosING1=[
    {
        id: "V36",
        titulo: "Surgimiento de la Ingeniería de software",  
        url: "https://youtu.be/It9QfJcj5vo?si=jD71Gt-JsOHUDUKW"
      },{
        id: "V37",
        titulo: "Ciclo de vida del software",  
        url: "https://youtu.be/QHOu7CEJR88?si=NRllhQbCkN0mstE3"
      },{
        id: "V38",
        titulo: "Scrum",  
        url: "https://youtu.be/HhC75IonpOU?si=lU5ETgGd6_psNaWy"
      },{
        id: "V39",
        titulo: "Waterfall ó Ágiles",  
        url: "https://youtu.be/uxlOPJC3NzY?si=LfxbvVx81SdZ1ZdY"
      },{
        id: "V40",
        titulo: "Waterfall ó Ágiles",  
        url: "https://youtu.be/VmkE1Frimwo?si=c8JH_dTl1YZL6vMD"
      },{
        id: "V41",
        titulo: "Modelos de procesos de desarrollo",  
        url: "https://youtu.be/uhZgYsUI2A8?si=oaf6CLAuG6gKDpaG"
      },{
        id: "V42",
        titulo: "Ética",  
        url: "https://youtu.be/mtyS2z3l_OU?si=tei1AO4Qky28Ly3S"
      }
]


//----------------------------BIBLIOGRAFÍA----------------------------

const bibliografia=[
{
        id:"B01",
        titulo: "Ingeniería del Software: Un enfoque práctico",
        autor:"Roger S. Pressman",
        editorial: "----"
      },
      {
        id:"B02",
        titulo: "Ingeniería del Software",
        autor:"Ian Sommerville",
        editorial: "----"
      },
      {
        id:"B03",
        titulo: "El proceso Unificado de desarrollo de software",
        autor:"Ivar Jacobson, Grady Booch, James Rumbaugh",
        editorial: "----"
      }]

//----------------------------RESOLVERS----------------------------

const resolvers = {

//-----QUERYS
  Query: {
    materias: () => materias,   //devuelve lista de materias con información completa
    materiaPorId: (_, { id }) => materias.find(m => m.id === id) //devuelve una materia específica por su ID
  }
  ,
  Materia: {
    resumenes: (materia) => resumenes.filter(r => materia.resumenes.includes(r.id)), //devuelve los resúmenes asociados a una materia
    videos: (materia) => {
      const allVideos = [VideosRedes,VideosBDD1, VideosSO1, VideosAC1, VideosAC2, VideosING1].flat(); // Combina todos los videos en una sola lista
      return allVideos.filter(v => materia.videos.includes(v.id));
    },
    bibliografia: (materia) => bibliografia.filter(b => materia.bibliografia.includes(b.id))
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 }
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})