import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { ProductCategory } from 'shared/generated-types';

import { RootNode, TreeNode } from './array-to-tree';
import { ProductCategoryTreeComponent } from './product-category-tree.component';

@Component({
    selector: 'vdr-product-category-tree-node',
    templateUrl: './product-category-tree-node.component.html',
    styleUrls: ['./product-category-tree-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoryTreeNodeComponent implements OnInit {
    depth = 0;
    parentName: string;
    @Input() categoryTree: TreeNode<ProductCategory.Fragment>;

    constructor(
        @SkipSelf() @Optional() private parent: ProductCategoryTreeNodeComponent,
        private root: ProductCategoryTreeComponent,
    ) {
        if (parent) {
            this.depth = parent.depth + 1;
        }
    }

    ngOnInit() {
        this.parentName = this.categoryTree.name || '<root>';
    }

    getMoveListItems(category: ProductCategory.Fragment): Array<{ path: string; id: string }> {
        const visit = (
            node: TreeNode<any>,
            parentPath: string[],
            output: Array<{ path: string; id: string }>,
        ) => {
            if (node.id !== category.id) {
                const path = parentPath.concat(node.name);
                if (node.id !== category.parent.id) {
                    output.push({ path: path.slice(1).join(' / ') || 'root', id: node.id });
                }
                node.children.forEach(child => visit(child, path, output));
            }
            return output;
        };
        return visit(this.root.categoryTree, [], []);
    }

    move(category: ProductCategory.Fragment, parentId: string) {
        this.root.onMove({
            index: 0,
            parentId,
            categoryId: category.id,
        });
    }

    moveUp(category: ProductCategory.Fragment, currentIndex: number) {
        this.root.onMove({
            index: currentIndex - 1,
            parentId: category.parent.id,
            categoryId: category.id,
        });
    }

    moveDown(category: ProductCategory.Fragment, currentIndex: number) {
        this.root.onMove({
            index: currentIndex + 1,
            parentId: category.parent.id,
            categoryId: category.id,
        });
    }

    drop(event: CdkDragDrop<ProductCategory.Fragment | RootNode<ProductCategory.Fragment>>) {
        this.root.onDrop(event);
    }
}
