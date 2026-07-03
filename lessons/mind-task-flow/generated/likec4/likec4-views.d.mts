/* prettier-ignore-start */
/* eslint-disable */

/******************************************************************************
 * This file was generated
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import type { PropsWithChildren } from 'react'
import type { JSX } from 'react/jsx-runtime'
import type { LikeC4Model } from 'likec4/model'
import type { LayoutedView } from 'likec4/model'
import type {
  LikeC4ViewProps as GenericLikeC4ViewProps,
  ReactLikeC4Props as GenericReactLikeC4Props
} from 'likec4/react'

import type { Aux, SpecAux } from 'likec4/model';

export type $Specs = SpecAux<
  // Element kinds
  | "actor"
  | "application"
  | "cockpit"
  | "component"
  | "database"
  | "db-table"
  | "executionloop"
  | "external-system"
  | "mobile"
  | "service"
  | "system"
  | "webapp"
  | "worker",
  // Deployment kinds
  never,
  // Relationship kinds
  | "many-to-many"
  | "solid",
  // Tags
  | "deprecated"
  | "next"
  | "teamA"
  | "teamB"
  | "v1"
  | "v1_1"
  | "v2",
  // Metadata keys
  never
>

export type $Aux = Aux<
  "layouted",
  // Elements
  | "agents"
  | "braide"
  | "claudeweb"
  | "gptweb"
  | "harness"
  | "hermes"
  | "likec4"
  | "lucas"
  | "mind"
  | "python"
  | "supabase"
  | "braide.acp"
  | "braide.bridgeC4"
  | "braide.session"
  | "harness.gates"
  | "harness.loop"
  | "harness.runner"
  | "likec4.export"
  | "likec4.source"
  | "mind.blueprint"
  | "mind.context"
  | "mind.registry"
  | "mind.systemic"
  | "mind.ui"
  | "python.enforce"
  | "python.pipeline"
  | "supabase.artifacts"
  | "supabase.events"
  | "supabase.knowledge"
  | "supabase.outputs"
  | "supabase.projectHome"
  | "supabase.snapshots"
  | "supabase.tasks"
  | "mind.blueprint.extract"
  | "mind.blueprint.project"
  | "mind.blueprint.publish"
  | "mind.systemic.audit"
  | "mind.systemic.contract"
  | "mind.systemic.flow"
  | "mind.systemic.routing",
  // Deployments
  never,
  // Views
  | "blueprint"
  | "continuity"
  | "flow"
  | "hybrid"
  | "index"
  | "mind"
  | "snapshots"
  | "systemic",
  // Project ID
  "mind-blueprint-spike",
  $Specs
>

export type $ElementId = $Aux['ElementId']
export type $DeploymentId = $Aux['DeploymentId']
export type $ViewId = $Aux['ViewId']

export type $ElementKind = $Aux['ElementKind']
export type $RelationKind = $Aux['RelationKind']
export type $DeploymentKind = $Aux['DeploymentKind']
export type $Tag = $Aux['Tag']
export type $Tags = readonly $Aux['Tag'][]
export type $MetadataKey = $Aux['MetadataKey']


declare function isLikeC4ViewId(value: unknown): value is $ViewId;

declare const likec4model: LikeC4Model<$Aux>;
declare function useLikeC4Model(): LikeC4Model<$Aux>;
declare function useLikeC4View(viewId: $ViewId): LayoutedView<$Aux>;

declare function LikeC4ModelProvider(props: PropsWithChildren): JSX.Element;

type IconRendererProps = {
  node: {
    id: string
    title: string
    icon?: string | undefined
  }
}
declare function RenderIcon(props: IconRendererProps): JSX.Element;

type LikeC4ViewProps = GenericLikeC4ViewProps<$Aux>;
declare function LikeC4View({viewId, ...props}: LikeC4ViewProps): JSX.Element;

type ReactLikeC4Props = GenericReactLikeC4Props<$Aux>
declare function ReactLikeC4({viewId, ...props}: ReactLikeC4Props): JSX.Element;

export {
  type LikeC4ViewProps,
  type ReactLikeC4Props,
  isLikeC4ViewId,
  useLikeC4Model,
  useLikeC4View,
  likec4model,
  LikeC4ModelProvider,
  LikeC4View,
  RenderIcon,
  ReactLikeC4
}
/* prettier-ignore-end */
