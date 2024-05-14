import React from "react";
import { Stage, Layer, Line } from "react-konva";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const App = () => {
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const pdfToHTML = async () => {
    var source = document.getElementById("HTMLtoPDF");
    
    html2canvas(source)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: 'a4',
          hotfixes: ['px_scaling'],
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('download.pdf');
      });
  };

  const wipeOff = ()=>{
    setLines([])
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div style={{
      width: window.innerWidth,
      height: window.innerHeight, display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ width: window.innerWidth,display: 'flex', flexDirection: 'column',alignItems:'center'}}>
        <h1>Signature Generator</h1>
        <p>

Introducing "Draw & Sign Pro", the ultimate tool for creating and saving digital drawings and signatures with ease. Whether you're an artist, a professional, or simply looking to add a personal touch to your documents, Draw & Sign Pro has you covered.


        </p>
      </div>
      <div style={{ width: '100%', height: '600px', backgroundColor: "#f5f5f5" }}>
        <div id="HTMLtoPDF" style={{ backgroundColor: "#f5f5f5 !important" }}>
          <Stage
            width={window.innerWidth}
            // height={window.innerHeight}
            // width={300}
            height={600}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {/* <Text text="Just start drawing" x={5} y={30} /> */}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
        <div style={{
          padding: "15px",
          display: 'flex', justifyContent: 'space-between',
          marginTop: "20px",

        }}>
          {/* <select
            value={tool}
            onChange={(e) => {
              setTool(e.target.value);
            }}
          >
            <option value="pen">Pen</option>
            <option value="eraser">Eraser</option>
          </select> */}
          <div class="dropdown">
            <button class="dropbtn">{tool.toUpperCase()} ↧</button>
            <div class="dropdown-content">
              <a href="#" onClick={() => setTool('pen')}>Pen</a>
              <a href="#" onClick={() => setTool('eraser')}>Eraser</a>

            </div>
          </div>
          <button className="button" onClick={wipeOff}>Erase All</button>
          <button className="button" onClick={pdfToHTML}>Save as PDF</button>
        </div>

      </div>
    </div>
  );
};

export default App;