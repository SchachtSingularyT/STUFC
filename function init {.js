function init() {
      if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
      var $ = go.GraphObject.make;  // for conciseness in defining templates

      myDiagram =
        $(go.Diagram, "myDiagramDiv",
          {
            "undoManager.isEnabled": true
          });

      // define the "sample" Node template
      myDiagram.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location"),
          $(go.Shape, "RoundedRectangle",  // define the node's outer shape
            { fill: "white", strokeWidth: 0 },
            new go.Binding("fill", "color")),
          $(go.TextBlock,  // define the node's text
            { margin: 5 },
            new go.Binding("text", "key"))
        );

      myDiagram.linkTemplate =
        $(go.Link, go.Link.Bezier,
          $(go.Shape, { strokeWidth: 1.5 }),
          $(go.Shape, { toArrow: "Standard" })
        );

      myDiagram.model = new go.GraphLinksModel([
        { key: "Alpha", color: "lightblue", location: new go.Point(0, 0) },
        { key: "Beta", color: "pink", location: new go.Point(60, 80) }
      ], [
          { from: "Alpha", to: "Beta" },
          { from: "Beta", to: "Alpha" }
        ]);


      // Now we can initialize a Diagram that looks at the visual tree that constitutes the Diagram above.
      myVisualTree =
        $(go.Diagram, "myVisualTree",
          {
            initialContentAlignment: go.Spot.Left,
            initialAutoScale: go.Diagram.Uniform,
            isReadOnly: true,  // do not allow users to modify or select in this view
            allowSelect: false,
            layout: $(go.TreeLayout, { nodeSpacing: 5 })  // automatically laid out as a tree
          });

      myVisualTree.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "darkkhaki", stroke: null }),  // assume a dark background
          $(go.TextBlock,
            {
              font: "bold 13px Helvetica, bold Arial, sans-serif",
              stroke: "black",
              margin: 3
            },
            // bind the text to the Diagram/Layer/Part/GraphObject converted to a string
            new go.Binding("text", "", function(x) {
              // if the node represents a link, be sure to include the "to/from" data for that link
              if (x instanceof go.Link) {
                var s = "Link#" + x.data.__gohashid;
                s += "(" + x.data.from + " to " + x.data.to + ")";
                return s;
              }
              else return x.toString();
            }))
        );

      myVisualTree.linkTemplate =
        $(go.Link,
          $(go.Shape, { stroke: "darkkhaki", strokeWidth: 2 })
        );

      drawVisualTree();
    }

    function drawVisualTree() {
      var visualNodeDataArray = [];

      // recursively walk the visual tree, collecting objects as we go
      function traverseVisualTree(obj, parent) {
        obj.vtkey = visualNodeDataArray.length;
        visualNodeDataArray.push(obj);
        if (parent) {
          obj.parentKey = parent.vtkey;
        }
        if (obj instanceof go.Diagram) {
          var lit = obj.layers;
          while (lit.next()) traverseVisualTree(lit.value, obj);
        } else if (obj instanceof go.Layer) {
          var pit = obj.parts;
          while (pit.next()) traverseVisualTree(pit.value, obj);
        } else if (obj instanceof go.Panel) {
          var eit = obj.elements;
          while (eit.next()) traverseVisualTree(eit.value, obj);
        }
      }

      traverseVisualTree(myDiagram, null);

      myVisualTree.model =
        go.GraphObject.make(go.TreeModel,
          {
            nodeKeyProperty: "vtkey",
            nodeParentKeyProperty: "parentKey",
            nodeDataArray: visualNodeDataArray
          });
    }
  