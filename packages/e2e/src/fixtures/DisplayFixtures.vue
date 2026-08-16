<script setup lang="ts">
import { ref } from 'vue'
import { Alert } from '@ccui/alert'
import { Avatar } from '@ccui/avatar'
import { Badge } from '@ccui/badge'
import { BadgeRibbon } from '@ccui/badge-ribbon'
import { BorderBeam } from '@ccui/border-beam'
import { Breadcrumb, BreadcrumbItem } from '@ccui/breadcrumb'
import { Button, ButtonGroup } from '@ccui/button'
import { Button3d } from '@ccui/button-3d'
import { Card } from '@ccui/card'
import { CardMeta } from '@ccui/card-meta'
import { Descriptions, DescriptionsItem } from '@ccui/descriptions'
import { Divider } from '@ccui/divider'
import { Empty } from '@ccui/empty'
import { Flex } from '@ccui/flex'
import { Col, Row } from '@ccui/grid'
import { Icon } from '@ccui/icon'
import { Content, Footer, Header, Layout, Sider } from '@ccui/layout'
import { Progress } from '@ccui/progress'
import { Result } from '@ccui/result'
import { Skeleton } from '@ccui/skeleton'
import { SkeletonNode } from '@ccui/skeleton-node'
import { Space } from '@ccui/space'
import { SpaceCompact } from '@ccui/space-compact'
import { Spin } from '@ccui/spin'
import { Steps } from '@ccui/steps'
import { Tag } from '@ccui/tag'
import { Timeline, TimelineItem } from '@ccui/timeline'
import { Link, Paragraph, Text, Title, Typography } from '@ccui/typography'
import { Watermark } from '@ccui/watermark'

const buttonClicks = ref(0)
const alertCloses = ref(0)
const currentStep = ref(1)
const iconClicks = ref(0)
const siderCollapsed = ref(false)
const tagClosed = ref(false)
</script>

<template>
  <section class="display-fixtures" data-testid="display-fixtures">
    <section data-testid="display-feedback">
      <Alert
        type="warning"
        message="Storage almost full"
        description="Remove unused files"
        show-icon
        closable
        @close="alertCloses++"
      />
      <output data-testid="alert-close-count">{{ alertCloses }}</output>
      <Progress :percent="42" />
      <Result status="success" title="Payment complete" sub-title="Receipt is ready" />
      <Spin tip="Loading preview"><div>Preview content</div></Spin>
    </section>

    <section data-testid="display-identity">
      <Avatar name="Ada Lovelace" :width="48" :height="48" />
      <Badge :count="120"><span>Inbox</span></Badge>
      <BadgeRibbon text="Featured" placement="end"><div>Ribbon content</div></BadgeRibbon>
      <BorderBeam color="#1677ff"><div>Beam content</div></BorderBeam>
      <Tag v-if="!tagClosed" color="success" closable @close="tagClosed = true">Stable</Tag>
    </section>

    <section data-testid="display-navigation">
      <Breadcrumb>
        <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        <BreadcrumbItem>Components</BreadcrumbItem>
      </Breadcrumb>
      <Steps
        v-model:current="currentStep"
        type="navigation"
        :items="[
          { title: 'Account', description: 'Create account' },
          { title: 'Profile', description: 'Add profile' },
          { title: 'Done', description: 'Finish setup' },
        ]"
      />
      <Timeline>
        <TimelineItem color="green">Project created</TimelineItem>
        <TimelineItem type="warning">Review requested</TimelineItem>
      </Timeline>
    </section>

    <section data-testid="display-actions">
      <ButtonGroup size="small">
        <Button type="primary" @click="buttonClicks++">Primary action</Button>
        <Button disabled>Unavailable action</Button>
      </ButtonGroup>
      <Button3d type="success" @click="buttonClicks++">3D action</Button3d>
      <output data-testid="display-button-clicks">{{ buttonClicks }}</output>
      <Icon aria-label="Settings icon" size="24px" color="rgb(255, 0, 0)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" /></svg>
      </Icon>
      <Icon aria-label="Clickable icon" clickable @click="iconClicks++">+</Icon>
      <output data-testid="icon-click-count">{{ iconClicks }}</output>
    </section>

    <section data-testid="display-content">
      <Card header="Release notes">
        <CardMeta title="Version 2" description="A stable release" />
      </Card>
      <Descriptions title="User profile" bordered :column="2">
        <DescriptionsItem label="Name">Grace Hopper</DescriptionsItem>
        <DescriptionsItem label="Role">Admiral</DescriptionsItem>
      </Descriptions>
      <Divider>More content</Divider>
      <Empty description="Nothing to display" />
    </section>

    <section data-testid="display-layout">
      <Flex justify="space-between" align="center" :gap="12"><span>Flex A</span><span>Flex B</span></Flex>
      <Row :gutter="16"><Col :span="8">Column A</Col><Col :span="16">Column B</Col></Row>
      <Layout>
        <Header>Site header</Header>
        <Layout>
          <Sider v-model:collapsed="siderCollapsed" :width="160" :collapsed-width="64" collapsible breakpoint="md">
            Side navigation
          </Sider>
          <Content>Page content</Content>
        </Layout>
        <Footer>Site footer</Footer>
      </Layout>
      <Space direction="vertical" :size="12"><span>Space A</span><span>Space B</span></Space>
      <SpaceCompact><Button>Compact A</Button><Button>Compact B</Button></SpaceCompact>
      <output data-testid="sider-collapsed">{{ siderCollapsed }}</output>
    </section>

    <section data-testid="display-loading">
      <Skeleton active avatar :paragraph="{ rows: 2 }" />
      <SkeletonNode active width="80px" height="24px"><span>Skeleton custom node</span></SkeletonNode>
    </section>

    <section data-testid="display-typography">
      <Typography>
        <Title :level="3">Typography title</Title>
        <Text strong>Strong text</Text>
        <Paragraph code>const answer = 42</Paragraph>
        <Link href="#display-target" target="_self">Documentation link</Link>
      </Typography>
    </section>

    <section id="display-target" data-testid="display-watermark">
      <Watermark content="CCUI E2E"><div>Protected document</div></Watermark>
    </section>
  </section>
</template>

<style scoped>
.display-fixtures {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
}

.display-fixtures > section {
  min-width: 0;
  padding: 16px;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  background: #fff;
}

[data-testid='display-feedback'],
[data-testid='display-navigation'],
[data-testid='display-content'],
[data-testid='display-layout'],
[data-testid='display-loading'],
[data-testid='display-typography'] {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

[data-testid='display-identity'],
[data-testid='display-actions'] {
  display: flex;
  align-items: center;
  align-content: flex-start;
  flex-wrap: wrap;
  gap: 24px;
}

[data-testid='display-watermark'] {
  min-height: 120px;
}
</style>
