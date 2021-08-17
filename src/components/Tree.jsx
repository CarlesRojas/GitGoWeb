import React, { useRef, useEffect, useState, memo, useContext } from "react";
import classnames from "classnames";

// Constants
const EDGE_WIDTH = 3;

const Tree = memo(({ commits, numColumns, mappedCommits, branches, colors }) => {
    console.log("RENDER TREE");

    // Node refs
    const nodes = useRef([]);

    // Edges
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        if (!nodes.current.length) return;

        // Check if last on a branch
        const isLastInBranch = (hash) => {
            for (let i = 0; i < branches.length; i++) {
                if ("commits" in branches[i] && branches[i].commits.length && hash === branches[i].commits[branches[i].commits.length - 1]) return true;
            }
            return false;
        };

        var edgesInfo = [];

        // Save edge info in each commit
        for (let i = 0; i < commits.length; i++) {
            if (!("parent" in commits[i])) continue;

            // Get source commit node center
            var sourceCenterX = nodes.current[i].offsetLeft + nodes.current[i].offsetWidth / 2;
            var sourceCenterY = nodes.current[i].offsetTop + nodes.current[i].offsetHeight / 2;

            for (let j = 0; j < commits[i].parent.length; j++) {
                const targetI = mappedCommits[commits[i].parent[j]];
                if (!targetI) {
                    var targetCenterX = sourceCenterX;
                    var targetCenterY = nodes.current[nodes.current.length - 1].offsetTop + nodes.current[nodes.current.length - 1].offsetHeight * 2;
                } else {
                    // Get target commit node center
                    targetCenterX = nodes.current[targetI].offsetLeft + nodes.current[targetI].offsetWidth / 2;
                    targetCenterY = nodes.current[targetI].offsetTop + nodes.current[targetI].offsetHeight / 2;
                }

                // Is commit last in branch
                var sourceLastInBranch = isLastInBranch(commits[i].commit.long);

                // Calculate sizes
                var top = Math.min(sourceCenterY, targetCenterY);
                var left = Math.min(sourceCenterX, targetCenterX);
                var width = Math.max(sourceCenterX, targetCenterX) - left;
                var height = Math.max(sourceCenterY, targetCenterY) - top;
                var type = width === 0 ? "left" : targetCenterX > sourceCenterX ? "topRight" : sourceLastInBranch ? "bottomRight" : "topLeft";
                var colorIndex = (sourceLastInBranch && targetCenterX < sourceCenterX) || !targetI ? i : targetI;

                // Save Edge
                edgesInfo.push({
                    key: commits[i].commit.long + " " + commits[i].parent[j],
                    top: top - EDGE_WIDTH / 2,
                    left: left - EDGE_WIDTH / 2,
                    width: width + EDGE_WIDTH,
                    height: height + EDGE_WIDTH,
                    type,
                    color: colors.current[commits[colorIndex].column % colors.current.length],
                });
            }
        }

        // Set edges
        setEdges(edgesInfo);
    }, [commits, mappedCommits, branches, colors]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="tree" style={{ width: `${numColumns * 2}rem`, maxWidth: `${numColumns * 2}rem`, minWidth: `${numColumns * 2}rem` }}>
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
