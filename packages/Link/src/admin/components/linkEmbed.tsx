import React from "react";
import { css } from "emotion";
import styled from "@emotion/styled";
import { ElementRoot } from "@webiny/app-page-builder/render/components/ElementRoot";
import { ReactComponent as LinkIcon } from "../../assets/link-icon.svg";
// import { Button } from "react-bootstrap";

const outerWrapper = css({
    boxSizing: "border-box"
});

const innerWrapper = css({
    left: 0,
    width: "100%",
    height: "auto",
    position: "relative",
    paddingBottom: 0
});

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 50,
    svg: {
        height: 50,
        width: 50,
        color: "var(--mdc-theme-text-secondary-on-background)"
    }
});

const LinkEmbed = props => {
    const { element } = props;
    console.log(element);
    if (!element.data.link.url) {
        return (
            <PreviewBox>
                <LinkIcon />
            </PreviewBox>
        );
    }

    return (
        <ElementRoot
            className={
                "webiny-pb-base-page-element-style webiny-pb-page-element-embed-link " +
                outerWrapper
            }
            element={element}
        >
            <div className={innerWrapper}>
                <button
                    className={`w-32 h-32 rounded-full mx-auto bg-gray-800 overflow-visible flex justify-center items-center`}
                >
                    <div
                        className={"absolute text-4xl whitespace-no-wrap -mt-2"}
                        style={{ letterSpacing: "0.1875em" }}
                    >
                        <a href={element.data.link.url}>{element.data.link.url}</a>
                    </div>
                </button>
            </div>
        </ElementRoot>
    );
};

export default LinkEmbed;
