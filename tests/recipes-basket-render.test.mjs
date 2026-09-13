import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { basketItems } from '../lib/recipes/model.mjs';
const require = createRequire(import.meta.url);
const source = fs.readFileSync(new URL('../components/recipes/Household.js',import.meta.url),'utf8');
const component = source.slice(source.indexOf('function Basket('),source.indexOf('export function AddRecipe'));
const { code } = require('next/dist/compiled/babel/core').transformSync(component,{filename:'Basket.jsx',babelrc:false,configFile:false,presets:[[require.resolve('next/babel'),{'preset-env':{targets:{node:'current'}}}]]});
const Basket = new Function('require','React','basketItems','amount',`${code.replace('import React from "react";', '')};return Basket;`)(require,React,basketItems,i=>`${i.quantity ?? ''} ${i.unit} ${i.name}`);
for (const agent of [false,true]) {
  test(`Basket renders empty and populated states with agent=${agent}`,()=>{
    const state={recipes:[],basket:{},checks:{},products:{}};
    const render=()=>renderToStaticMarkup(React.createElement(Basket,{store:{state,agent,act(){},job(){}}}));
    assert.match(render(),/Your basket is empty/);
    state.recipes.push({id:'sample',name:'Test recipe',servings:2,ingredients:[{name:'Rice',quantity:100,unit:'g',section:'Pantry'}]});
    state.basket.sample=4;
    const output=render();assert.match(output,/200 g Rice/);assert.match(output,/Test recipe/);assert.doesNotMatch(output,/Your basket is empty/);
  });
}
