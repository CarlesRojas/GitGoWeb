import React, { useRef, useEffect, useState, memo } from "react";
import classnames from "classnames";

const Tree = memo(({ commits, numColumns, mappedCommits }) => {
    // export default function Tree({ commits, numColumns, mappedCommits }) {

    // Colors for branches
    const colors = useRef(["#82b4ff", "#de82ff", "#ff8282", "#ffb882", "#fffb82", "#b6ff82"]);

    // Node refs
    const nodes = useRef([]);

    // Edges
    const [edges, setEdges] = useState([]);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    useEffect(() => {
        if (!nodes.current.length) return;

        var edgesInfo = [];

        // Save edge info in each commit
        for (let i = 0; i < commits.length; i++) {
            if (!("parent" in commits[i])) continue;

            // Get source commit node center
            var sourceCenterX = nodes.current[i].offsetLeft + nodes.current[i].offsetWidth / 2;
            var sourceCenterY = nodes.current[i].offsetTop + nodes.current[i].offsetHeight / 2;

            for (let j = 0; j < commits[i].parent.length; j++) {
                const targetI = mappedCommits[commits[i].parent[j]];
                if (!targetI) continue;

                // Get target commit node center
                var targetCenterX = nodes.current[targetI].offsetLeft + nodes.current[targetI].offsetWidth / 2;
                var targetCenterY = nodes.current[targetI].offsetTop + nodes.current[targetI].offsetHeight / 2;

                // Calculate sizes
                var top = Math.min(sourceCenterY, targetCenterY);
                var left = Math.min(sourceCenterX, targetCenterX);
                var width = Math.max(sourceCenterX, targetCenterX) - left;
                var height = Math.max(sourceCenterY, targetCenterY) - top;

                var type = width === 0 ? "left" : targetCenterX > sourceCenterX ? "topRight" : "bottomRight";

                // Save Edge
                edgesInfo.push({
                    key: commits[i].commit.long + " " + commits[targetI].commit.long,
                    top: top - 2,
                    left: left - 2,
                    width: width + 4,
                    height: height + 4,
                    type,
                    color: colors.current[commits[i].column % colors.current.length],
                });
            }
        }

        // Set edges
        setEdges(edgesInfo);
    }, [commits, mappedCommits]);

    // #################################################
    //   RENDER
    // #################################################

    console.log("render");

    return (
        <div className="tree" style={{ width: `${numColumns * 2}rem` }}>
            {edges.map(({ key, top, left, width, height, type, color }) => {
                return (
                    <div
                        className={classnames("edge", type)}
                        key={key}
                        style={{
                            top: `${top}px`,
                            left: `${left}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                            borderColor: color,
                        }}
                    ></div>
                );
            })}

            {commits.map(({ commit, column }) => {
                return (
                    <div className="node" key={commit.long} style={{ marginLeft: `${column * 2}rem` }} ref={(elem) => nodes.current.push(elem)}>
                        <div className="circle" style={{ backgroundColor: colors.current[column % colors.current.length] }}></div>
                    </div>
                );
            })}
        </div>
    );
});

export default Tree;
