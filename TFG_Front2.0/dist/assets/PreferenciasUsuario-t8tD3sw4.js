import{d as I,u as q,r as l,a as B,b as D,c as d,o as U,_ as L,e as n,f as t,g as s,w as c,v as h,h as y,F as g,i as p,t as m,p as V,j as $,k as T}from"./index-J51e8X-9.js";const j=I({setup(){const e=q(),r=l([]),i=l([]),S=B(),b=D(),f=l([]),a=l([]),v=l(""),w=l(""),A=d(()=>e.allCategorias),M=d(()=>e.allIngredientes),k=d(()=>A.value.filter(o=>o.nombreCategoria.toLowerCase().includes(v.value.toLowerCase()))),E=d(()=>M.value.filter(o=>o.nombreIngrediente.toLowerCase().includes(w.value.toLowerCase()))),P=async()=>{try{const o={idMenuSemanal:0,descripcion:"Menú Semanal generado",fechaInicio:new Date().toISOString().split("T")[0],tipoComida:!0,categorias:r.value,alergenos:i.value,idUsuario:1,recetas:[]};await S.crearMenuSemanal(o),b.push("/MenuSemanal")}catch(o){console.error("Error al generar el menú semanal:",o)}},_=async()=>{try{await e.guardarCategoriasSeleccionadas(r.value),alert("Preferencias guardadas exitosamente"),await C()}catch(o){console.error("Error al guardar preferencias:",o)}},G=async()=>{try{await e.guardarAlergenosSeleccionados(i.value),alert("Preferencias guardadas exitosamente"),await C()}catch(o){console.error("Error al guardar preferencias:",o)}},C=async()=>{try{await e.obtenerCategorias(),await e.obtenerAlergenos(),f.value=e.usuariosCategoria,a.value=e.ingredientes.filter(o=>e.ingredientes.some(F=>F.idIngrediente==o.idIngrediente))}catch(o){console.error("Error al obtener preferencias guardadas:",o)}};return U(async()=>{await e.fetchCategorias(),await e.getAllIngredientes(),await C()}),{categoriasSeleccionadas:r,alergenosSeleccionados:i,categoriasGuardadas:f,alergenosGuardados:a,busquedaCategorias:v,busquedaAlergenos:w,categoriasFiltradas:k,alergenosFiltrados:E,guardarCategorias:_,guardarAlergenos:G,generarMenuSemanal:P}}}),u=e=>(V("data-v-0772f59c"),e=e(),$(),e),N={class:"preferencias-container"},O={class:"preferencias-categorias"},R=u(()=>s("h2",null,"Preferencias de Categorías",-1)),z=["value"],H={class:"preferencias-alergenos"},J=u(()=>s("h2",null,"Alérgenos",-1)),K=["value"],Q={class:"preferencias-guardadas"},W=u(()=>s("h2",null,"Preferencias Guardadas",-1)),X=u(()=>s("h3",null,"Categorías Seleccionadas:",-1)),Y=u(()=>s("h3",null,"Alérgenos Seleccionados:",-1));function Z(e,r,i,S,b,f){return n(),t("div",N,[s("section",O,[R,c(s("input",{type:"text","onUpdate:modelValue":r[0]||(r[0]=a=>e.busquedaCategorias=a),placeholder:"Buscar categorías...",class:"buscador-categorias"},null,512),[[h,e.busquedaCategorias]]),c(s("select",{"onUpdate:modelValue":r[1]||(r[1]=a=>e.categoriasSeleccionadas=a),multiple:"",class:"categoria-select"},[(n(!0),t(g,null,p(e.categoriasFiltradas,a=>(n(),t("option",{key:a.idCategoria,value:a.idCategoria},m(a.nombreCategoria),9,z))),128))],512),[[y,e.categoriasSeleccionadas]]),s("button",{onClick:r[2]||(r[2]=(...a)=>e.guardarCategorias&&e.guardarCategorias(...a)),class:"btn-guardar"},"Guardar Preferencias")]),s("section",H,[J,c(s("input",{type:"text","onUpdate:modelValue":r[3]||(r[3]=a=>e.busquedaAlergenos=a),placeholder:"Buscar alérgenos...",class:"buscador-alergenos"},null,512),[[h,e.busquedaAlergenos]]),c(s("select",{"onUpdate:modelValue":r[4]||(r[4]=a=>e.alergenosSeleccionados=a),multiple:"",class:"alergenos-select"},[(n(!0),t(g,null,p(e.alergenosFiltrados,a=>(n(),t("option",{key:a.idIngrediente,value:a.idIngrediente},m(a.nombreIngrediente),9,K))),128))],512),[[y,e.alergenosSeleccionados]]),s("button",{onClick:r[5]||(r[5]=(...a)=>e.guardarAlergenos&&e.guardarAlergenos(...a)),class:"btn-guardar"},"Guardar Preferencias")]),s("section",Q,[W,s("div",null,[X,s("ul",null,[(n(!0),t(g,null,p(e.categoriasGuardadas,a=>(n(),t("li",{key:a.idCategoria},m(a.nombreCategoria),1))),128))]),Y,s("ul",null,[(n(!0),t(g,null,p(e.alergenosGuardados,a=>(n(),t("li",{key:a.idAlergeno},m(a.nombreIngrediente),1))),128))])])]),s("button",{onClick:r[6]||(r[6]=(...a)=>e.generarMenuSemanal&&e.generarMenuSemanal(...a)),class:"btn-generar-menu"},"Generar Menú Semanal")])}const x=L(j,[["render",Z],["__scopeId","data-v-0772f59c"]]),ae=I({__name:"PreferenciasUsuario",setup(e){return(r,i)=>(n(),T(x))}});export{ae as default};
