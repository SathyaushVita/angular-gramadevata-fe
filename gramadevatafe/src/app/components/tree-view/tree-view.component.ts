
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TemplecategoryserviceService } from '../../services/templecategoryservice/templecategoryservice.service';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { FormsModule } from '@angular/forms';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzInputModule } from 'ng-zorro-antd/input';
import { GoshalaService } from '../../services/goshalaservice/goshala.service';
import { EventService } from '../../services/eventservice/event.service';
import { LocationService } from '../../services/location/location.service';
import { CommonModule } from '@angular/common';
import { NzTreeNode } from 'ng-zorro-antd/core/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTreeModule, NzInputModule,NzTreeSelectModule],
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TreeViewComponent implements OnInit {
  categoryList: any[] = [];
  treeClicked: boolean = false;
  nodes: NzTreeNodeOptions[] = [];
  filteredNodes: any[] = [];
  locationNodes: NzTreeNodeOptions[] = [];
  searchValue: string = '';
  sidebarVisible: boolean = false;
  indiaId: any;
  @Input() treeType: string = '';
  @Input() disabled: boolean = false;
  @Output() nodeClick = new EventEmitter<any>();
  @Output() categoryClick = new EventEmitter<string>();


  treeType1 = 'india';
  showTree = false;  // Flag to toggle the visibility
  SubcategoryList: any;

  // Method to toggle the visibility of the nz-tree component
  toggleTree() {
    this.showTree = !this.showTree;
  }

  onNodeClick(node: NzTreeNodeOptions): void {
    this.nodeClick.emit({ treeType: this.treeType, node });
  }

 


  // Convert NzTreeNodeOptions[] to NzTreeNode[]
convertToNzTreeNode(nodes: NzTreeNodeOptions[]): NzTreeNode[] {
  return nodes.map(node => new NzTreeNode(node));
}


  constructor(
    private templeCategoryService: TemplecategoryserviceService,
    private goshalaService: GoshalaService,
    private eventService: EventService,
    private locationService: LocationService
  ) {}


  selectedValue: any = '';

  onSelectChange(selectedNode: any) {
    if (!selectedNode) {
      console.log("No category selected.");
      return;
    }
    console.log("Selected Node:", selectedNode);
  }
  
  


  ngOnInit(): void {
    
  
    this.templeCategoryService.GetallCategories().subscribe(
      (res: any[]) => {
        this.categoryList = res;
  
        if (this.treeType === 'templecategory') {
          const filteredCategories = this.categoryList.filter(category =>
            !['Buddist Temples', 'Gurudwara Temples', 'Jain Temples'].includes(category.name)
          );
  
          this.nodes = this.createNodeTree(filteredCategories);
          this.nodes.push({ key: 'AllTemples', title: 'All Temples', value: 'AllTemples' });
  
          const priorityNodes = ["All Temples", "Jyotirlingas", "Maha Sakthi peetas", "Asta Vinayaka", "Chardham", "Chota Chardham"];
          this.filteredNodes = this.nodes
          this.filteredNodes.sort((a, b) => {
            const aPriority = priorityNodes.includes(a.title) ? 0 : 1;
            const bPriority = priorityNodes.includes(b.title) ? 0 : 1;
            return aPriority !== bPriority ? aPriority - bPriority : a.title.localeCompare(b.title);
          });
  
          console.log(this.nodes, "TempleCategory Nodes");
        }
  
        if (this.treeType === 'subreligions') {
          this.SubcategoryList = this.categoryList.filter(category =>
            ['Buddist Temples', 'Gurudwara Temples', 'Jain Temples'].includes(category.name)
          );
  
          this.nodes = this.createNodeTree(this.SubcategoryList);
          this.nodes.sort((a, b) => a.title.localeCompare(b.title));
          console.log(this.nodes, "Subcategory Nodes");
        }
      },
      (err: any) => console.error('Error loading category data:', err)
    );
  
    if (this.treeType === 'goshalacategory') {
      this.goshalaService.getGoshalaCatgeories().subscribe(
        (res: any[]) => {
          this.categoryList = res;
          this.nodes = this.createNodeTree(this.categoryList);
          this.nodes.push({ key: 'AllGoshalas', title: 'All Goshalas', value: 'AllGoshalas' });
          this.nodes.sort((a, b) => a.title.localeCompare(b.title));
        },
        (err: any) => console.error('Error loading goshala categories:', err)
      );
    }
  
    if (this.treeType === 'eventcategory') {
      this.eventService.getEventCategory().subscribe(
        (res: any[]) => {
          this.categoryList = res;
          this.nodes = this.createNodeTree(this.categoryList);
          this.nodes.push({ key: 'AllEvents', title: 'All Events', value: '' });
          this.nodes.sort((a, b) => a.title.localeCompare(b.title));
        },
        (err: any) => console.error('Error loading event categories:', err)
      );
    }
  
    if (this.treeType === 'india') {
      this.locationService.getNameByCountry('India').subscribe(
        (data: any[]) => {
          if (Array.isArray(data) && data.length > 0) {
            this.indiaId = data[0]._id;
            this.locationService.getbyStates(this.indiaId).subscribe(
              (res: any[]) => {
                this.locationNodes = this.createNodeTree(res);
                this.locationNodes.sort((a, b) => a.title.localeCompare(b.title));
              },
              (err: any) => console.error('Error fetching states data:', err)
            );
          } else {
            console.error('No category data found');
          }
        },
        (error: any) => console.error('Error fetching country data:', error)
      );
    }
  
    if (this.treeType === 'global') {
      this.locationService.GetAllCountries().subscribe(
        (res: any[]) => {
          this.categoryList = res;
          this.nodes = this.createNodeTree(this.categoryList);
          this.nodes.sort((a, b) => a.title.localeCompare(b.title));
        },
        (err: any) => console.error('Error loading global data:', err)
      );
    }
    this.filteredNodes = [...this.nodes];
    console.log("123456", this.filteredNodes)
  }

  
  
  onSearch(value: string): void {
    this.searchValue = value.toLowerCase().trim();
  
    if (!this.searchValue) {
      this.filteredNodes = [...this.nodes];
      return;
    }

  
    const priorityNodes = ["All Temples", "Jyotirlingas", "Maha Sakthi peetas", "Asta Vinayaka", "Chardham", "Chota Chardham"];
  
    this.filteredNodes = [...this.nodes].sort((a, b) => {
      const aMatch = a.title.toLowerCase().includes(this.searchValue) ? -1 : 1;
      const bMatch = b.title.toLowerCase().includes(this.searchValue) ? -1 : 1;
      return aMatch - bMatch;
    });
  }

 
  
  

  

onCategoryClick(categoryId: string): void {
  this.categoryClick.emit(categoryId);
}

// In your component.ts file
nzEvent(event: NzFormatEmitEvent): void {
  const node = event.node!;

  if (event.eventName === 'click') {
    // Convert locationNodes to NzTreeNode[]
    const nzTreeNodes = this.convertToNzTreeNode(this.locationNodes);

    // Collapse all other nodes
    // this.collapseAllNodes(nzTreeNodes, node.key);

    if (!node.isExpanded) {
      if (node.children?.length === 0 && !node.isLeaf) {
        switch (node.level) {
          case 0:
            if (this.treeType === 'india') {
              this.loadDistrictNodesForStates(node);
            } else if (this.treeType === 'global') {
              this.loadStateNodes(node);
            }
            break;
          case 1:
            if (this.treeType === 'india') {
              this.loadBlocks(node);
            } else if (this.treeType === 'global') {
              this.loadDistrictNodes(node);
            }
            break;
          case 2:
            if (this.treeType === 'india') {
              this.loadVillages(node);
            } else if (this.treeType === 'global') {
              this.loadglobalBlocks(node);
            }
            break;
          case 3:
            if (this.treeType === 'global') {
              this.loadglobalVillages(node);
            }
            break;
          default:
            break;
        }
      }
      node.isExpanded = true;
    }

    // Deselect all nodes
    this.deselectAllNodes(nzTreeNodes);
    // Select the clicked node
    node.isSelected = true;

    this.nodeClick.emit(event);
    this.treeClicked = true;
  }
}



// Helper method to deselect all nodes
deselectAllNodes(nodes: NzTreeNode[]): void {
  nodes.forEach(node => {
    node.isSelected = false;
    if (node.children) {
      this.deselectAllNodes(node.children);
    }
  });
}









  createNodeTree(list: any[]): NzTreeNodeOptions[] {
    return list.map(listItem => ({
      key: listItem._id,
      title: listItem.name,
      isLeaf: false,
      children: [],
    }));
  }

  isIndiaTreeType(): boolean {
    return this.treeType === 'india';
  }
  onTreeTypeChange(newType: string): void {
    this.treeType = newType;
    this.treeType = newType;
    // Additional logic if needed
  }

  loadDistrictNodesForStates(stateNode: NzTreeNodeOptions): void {
    this.locationService.getdistricts(stateNode.key).subscribe(
      (districts: any[]) => {
        const updatedNodes = this.locationNodes.map(node => {
          if (node.key === stateNode.key) {
            return {
              ...node,
              children: districts.map((district: any) => ({
                key: district._id,
                title: district.name,
                isLeaf: false,
                level: 'district',
                expandable: true,
                children: [],
              })),
            };
          }
          return node;
        });
        this.locationNodes = [...updatedNodes];
      },
      (error: any) => console.error('Error fetching districts:', error)
    );
  }

  loadBlocks(districtNode: NzTreeNodeOptions): void {
    this.locationService.getblocks(districtNode.key).subscribe(
      (blocks: any[]) => {
        const updatedNodes = this.locationNodes.map(node => {
          if (node.children) {
            return {
              ...node,
              children: node.children.map(childNode => {
                if (childNode.key === districtNode.key) {
                  return {
                    ...childNode,
                    children: blocks.map(block => ({
                      key: block._id,
                      title: block.name,
                      isLeaf: false,
                      expandable: true,
                      children: [],
                    })),
                  };
                }
                return childNode;
              }),
            };
          }
          return node;
        });
        this.locationNodes = [...updatedNodes];
      },
      (error: any) => console.error('Error fetching blocks:', error)
    );
  }

  loadVillages(blockNode: NzTreeNodeOptions): void {
    this.locationService.getvillages(blockNode.key).subscribe(
      (villages: any[]) => {
        const updatedNodes = this.locationNodes.map(stateNode => {
          if (stateNode.children) {
            return {
              ...stateNode,
              children: stateNode.children.map(districtNode => {
                if (districtNode.children) {
                  return {
                    ...districtNode,
                    children: districtNode.children.map(innerBlockNode => {
                      if (innerBlockNode.key === blockNode.key) {
                        return {
                          ...innerBlockNode,
                          children: villages.map(village => ({
                            key: village._id,
                            title: village.name,
                            isLeaf: true,
                            expandable: false,
                            children: [],
                          })),
                        };
                      }
                      return innerBlockNode;
                    }),
                  };
                }
                return districtNode;
              }),
            };
          }
          return stateNode;
        });
        this.locationNodes = [...updatedNodes];
      },
      (error: any) => console.error('Error fetching villages:', error)
    );
  }

  loadStateNodes(globalNode: NzTreeNodeOptions): void {
    this.locationService.getbyStates(globalNode.key).subscribe(
      (states: any[]) => {
        this.locationNodes = this.locationNodes.map(node => {
          if (node.key === globalNode.key) {
            return {
              ...node,
              children: states.map(state => ({
                key: state._id,
                title: state.name,
                isLeaf: false,
                level: 'state',
                expandable: true,
                children: [],
              })),
            };
          }
          return node;
        });
      },
      (error: any) => console.error('Error fetching states:', error)
    );
  }

  loadDistrictNodes(globalNode: NzTreeNodeOptions): void {
    this.locationService.getdistricts(globalNode.key).subscribe(
      (districts: any[]) => {
        this.locationNodes = this.locationNodes.map(node => {
          if (node.key === globalNode.key) {
            return {
              ...node,
              children: districts.map(district => ({
                key: district._id,
                title: district.name,
                isLeaf: false,
                level: 'district',
                expandable: true,
                children: [],
              })),
            };
          }
          return node;
        });
      },
      (error: any) => console.error('Error fetching districts:', error)
    );
  }

  loadglobalBlocks(globalNode: NzTreeNodeOptions): void {
    this.locationService.getblocks(globalNode.key).subscribe(
      (blocks: any[]) => {
        this.locationNodes = this.locationNodes.map(node => {
          if (node.key === globalNode.key) {
            return {
              ...node,
              children: blocks.map(block => ({
                key: block._id,
                title: block.name,
                isLeaf: false,
                level: 'block',
                expandable: true,
                children: [],
              })),
            };
          }
          return node;
        });
      },
      (error: any) => console.error('Error fetching blocks:', error)
    );
  }

  loadglobalVillages(globalNode: NzTreeNodeOptions): void {
    this.locationService.getvillages(globalNode.key).subscribe(
      (villages: any[]) => {
        this.locationNodes = this.locationNodes.map(node => {
          if (node.key === globalNode.key) {
            return {
              ...node,
              children: villages.map(village => ({
                key: village._id,
                title: village.name,
                isLeaf: true,
                level: 'village',
                expandable: false,
                children: [],
              })),
            };
          }
          return node;
        });
      },
      (error: any) => console.error('Error fetching villages:', error)
    );
  }
}
