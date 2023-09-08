import * as React from 'react';
import papa from "papaparse";
import { useState, useEffect } from 'react';
import { Vega } from "react-vega";

export const Bubble = ({url})=>{
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = React.useState();
    const [cols, setCols] = React.useState();

    useEffect(() => {
      if (url) {
        setIsLoading(true);
        //  TODO: exception handling. What if the file doesn't exist? What if fetching was not possible?
        loadData(url).then((data) => {
          const { rows, fields } = parseCsv(data);
          setData(rows);
          setCols(fields as any);
          setIsLoading(false);
        });
      }
    }, [url]);

    const spec= {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "description": "A bubble plot showing the correlation between health and income for 187 countries in the world (modified from an example in Lisa Charlotte Rost's blog post 'One Chart, Twelve Charting Libraries' --http://lisacharlotterost.github.io/2016/05/17/one-chart-code/).",
      "width": 500,"height": 300,
      "data": {"values": data},
      "params": [{
        "name": "view",
        "select": "interval",
        "bind": "scales"
      }],
      "mark": "circle",
      "encoding": {
        "y": {
          "field": "health",
          "type": "quantitative",
          "scale": {"zero": false},
          "axis": {"minExtent": 30}
        },
        "x": {
          "field": "income",
          "scale": {"type": "log"}
        },
        "size": {"field": "population", "type": "quantitative"},
        "color": {"value": "#000"}
      }
    }
   
    return <div>
    
    
  
    {data && <Vega spec={spec as any} actions={false}></Vega>}
    </div>

}


/* 
I didnt want to clone the repo for this demo 
I took this dependency code from the portaljs dependency and duplicated it here for POC
*/

async function loadData(url: string) {
    const response = await fetch(url)
    const data = await response.text()
    return data
  }


const parseCsv = (csv: string) => {
  csv = csv.trim();
  const rawdata = papa.parse(csv, { header: true });

  let cols: any[] = [];
  if(rawdata.meta.fields) {
    cols = rawdata.meta.fields.map((r: string) => {
      return { key: r, name: r };
    });
  }

  return {
    rows: rawdata.data as any,
    fields: cols,
  };
};