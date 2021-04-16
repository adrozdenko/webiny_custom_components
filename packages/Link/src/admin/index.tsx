import React from "react";
import styled from "@emotion/styled";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import {
    PbEditorPageElementPlugin,
    PbEditorPageElementAdvancedSettingsPlugin
} from "@webiny/app-page-builder/types";
import { validation } from "@webiny/validation";
import { ReactComponent as LinkIcon } from "../assets/link-icon.svg";
import LinkEmbed from "./components/linkEmbed";

import {
    ButtonContainer,
    classes,
    SimpleButton
} from "@webiny/app-page-builder/editor/plugins/elementSettings/components/StyledComponents";
import Accordion from "@webiny/app-page-builder/editor/plugins/elementSettings/components/Accordion";

const PreviewBox = styled("div")({
    textAlign: "center",
    height: 50,
    svg: {
        height: 50,
        width: 50,
        color: "var(--mdc-theme-text-secondary-on-background)"
    }
});

export default () => {
    return [
        {
            name: "pb-editor-page-element-link",
            type: "pb-editor-page-element",
            elementType: "link",
            toolbar: {
                // We use `pb-editor-element-group-media` to put our plugin into the Media group.
                title: "link",
                group: "pb-editor-element-group-media",
                preview() {
                    return (
                        <PreviewBox>
                            <LinkIcon />
                        </PreviewBox>
                    );
                }
            },
            settings: ["pb-editor-page-element-settings-delete"],
            target: ["cell", "block"],
            onCreate: "open-settings",
            create(options) {
                return {
                    type: "link",
                    elements: [],
                    data: {
                        link: {
                            href: "",
                            height: 370
                        },
                        settings: {
                            horizontalAlign: "center",
                            margin: {
                                desktop: { all: 0 },
                                mobile: { all: 0 }
                            },
                            padding: {
                                desktop: { all: 0 },
                                mobile: { all: 0 }
                            }
                        }
                    },
                    ...options
                };
            },
            render(props) {
                return <LinkEmbed {...props} />;
            },
            renderElementPreview({ width, height }) {
                return <img style={{ width, height }} alt={"link"} />;
            }
        } as PbEditorPageElementPlugin,
        {
            name: "pb-editor-page-element-advanced-settings-link",
            type: "pb-editor-page-element-advanced-settings",
            elementType: "link",
            render({ Bind, submit }) {
                return (
                    <Accordion title={"Link"} defaultValue={true}>
                        <React.Fragment>
                            <Bind name={"link.url"} validators={validation.create("required,url")}>
                                <Input label={"URL"} description={"Enter an link URL"} />
                            </Bind>
                            <Grid className={classes.simpleGrid}>
                                <Cell span={12}>
                                    {/* @ts-ignore */}
                                    <ButtonContainer>
                                        {/* @ts-ignore */}
                                        <SimpleButton onClick={submit}>Save</SimpleButton>
                                    </ButtonContainer>
                                </Cell>
                            </Grid>
                        </React.Fragment>
                    </Accordion>
                );
            }
        } as PbEditorPageElementAdvancedSettingsPlugin
    ];
};
