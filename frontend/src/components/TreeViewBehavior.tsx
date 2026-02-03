import React from 'react';
import { Box, Typography } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';

interface TreeDataNode {
  id: string;
  label: string;
  children?: TreeDataNode[];
  type: 'folder' | 'file';
}

interface TreeViewBehaviorProps {
  data: TreeDataNode[];
  onNodeSelect?: (nodeId: string) => void;
  onToggle?: (nodeIds: string[]) => void;
}

const TreeViewBehavior: React.FC<TreeViewBehaviorProps> = ({ data, onNodeSelect, onToggle }) => {
  const renderTree = (nodes: TreeDataNode) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          {nodes.type === 'folder' ? (
            <FolderIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
          ) : (
            <FileIcon color="action" sx={{ mr: 1, fontSize: '1.2rem' }} />
          )}
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {nodes.label}
          </Typography>
        </Box>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <Box sx={{ width: '100%', overflowY: 'auto' }}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={(_event, nodeId) => onNodeSelect?.(nodeId as string)}
        onNodeToggle={(_event, nodeIds) => onToggle?.(nodeIds)}
        sx={{ height: 'auto', flexGrow: 1, maxWidth: 400 }}
      >
        {data.map((rootNode) => renderTree(rootNode))}
      </TreeView>
    </Box>
  );
};

export default TreeViewBehavior;