<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-select 
			  	v-model="value2"
			  	placeholder="请选择"
				@change="selectChange"
			    style="float:right;">
				<el-option
				v-for="item in options2"
				:key="item.value"
				:label="item.label"
				:value="item.value"
				:disabled="item.disabled">
				</el-option>
			</el-select>
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table
			:data="users"
			highlight-current-row
			v-loading="listLoading"
			@selection-change="selsChange"
			style="width: 100%;"
			>
			<el-table-column
				type="selection"
				width="55"
				>
			</el-table-column>
			<el-table-column
				type="index"
				width="60"
				>
			</el-table-column>
			<el-table-column
				prop="name"
				label="名称"
				show-overflow-tooltip
				width="150"
				sortable
				>
			</el-table-column>
			<el-table-column
				prop="serial"
				label="序列号"
				width="200"
				sortable
				show-overflow-tooltip
				>
			</el-table-column>
			<el-table-column
				prop="date"
				label="入库日期"
				width="130"
				:formatter="formData"
				sortable
				>
			</el-table-column>
			<el-table-column
				prop="dateout"
				label="出库时间"
				width="180"
				:formatter="formatdateout"
				sortable
				>
			</el-table-column>
			<el-table-column 
				prop="state" 
				label="状态" 
				min-width="100" 
				sortable
				>
				<template slot-scope="scope">
					<el-tag
						v-text="scope.row.state === 1 ? '已售' : '未售'"
						:type="scope.row.state === 0 ? 'danger' : 'success'"
						></el-tag>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				width="150"
				>
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-button type="primary" @click='download'>数据导出</el-button>
			<el-pagination 
				layout="prev, pager, next" 
				@current-change="handleCurrentChange" 
				:page-size="1"
				:total="total" 
				style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="editForm.state">
						<el-radio class="radio" :label="1">已售</el-radio>
						<el-radio class="radio" :label="0">未售</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="序列号">
					<el-input v-model="editForm.serial"></el-input>
				</el-form-item>
				<el-form-item label="入库时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="出库时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.dateout"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="addForm.state">
						<el-radio class="radio" :label="1">已售</el-radio>
						<el-radio class="radio" :label="0">未售</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="系列号">
					<el-input v-model="addForm.serial"></el-input>
				</el-form-item>
				<el-form-item label="入库时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="出库时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.dateout"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { formDate, dataExport, getSelect, getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api'

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				pagenub: 10,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					state: -1,
					serial: 0,
					date: '',
					dateout: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					state: -1,
					serial: 0,
					date: '',
					dateout: ''
				},
				options2: [{
					value: 'lista',
					label: '助听器1'
				}, {
					value: 'listb',
					label: '助听器2',
					disabled: true
				}, {
					value: 'listc',
					label: '助听器3'
				}, {
					value: 'listd',
					label: '助听器4'
				}],
					value2: '全部'

			}
		},
		methods: {
			//时间戳转换
			formData: function (row, column) {
				return formDate(row.date)
			},
			//如果没有出库显示库存中
			formatdateout: function (row, column) {
				return !row.dateout ? '库存中' : formDate(row.dateout) ;
				// if(!row.dateout) {
				// 	console.log(1);
				// 	return row.dateout = '库存中'
				// } else {
				// 	return row.dateout
				// }
			},
			//pagination分页跳转
			handleCurrentChange:function (val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers: function() {
				let para = {
					pageNum: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				getUserListPage(para).then((res) => {
					let data = res.data;
					this.pagenub = data.pageNum;
					this.total = data.total;
					this.users = data.list;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					}).catch( (err) => {
						this.listLoading = false;
						this.$message({
							message: '删除失败',
							type: 'warning'
						});
					});
				}).catch(() => {

				});
			},
			//数据导出
			download: function() {
				let para = {
					name: this.filters.name
				};
				dataExport(para).then( (res) => {
					this.$message({
						message: '导出成功',
						type: 'success'
					});
				}).catch( (err) => {
					this.$message({
						message: '导出失败',
						type: 'warning'
					});
				})
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					state: -1,
					serial: 0,
					date: '',
					dateout: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let data = Object.assign({}, this.editForm);
							let para = {
								name: data.name,
								state: data.state,
								serial: data.serial,
								date: data.date,
								dateout: data.dateout,
								id: data.id									
							}
							para.date = (!para.date || para.date == '') ? '' : Date.parse(new Date(para.date));
							para.dateout = (!para.dateout || para.dateout == '') ? '' : Date.parse(new Date(para.date));
							editUser(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							// para.date = (!para.date || para.date == '') ? '' : util.formatDate.format(new Date(para.date), 'yyyy-MM-dd');
							// para.dateout = (!para.dateout || para.dateout == '') ? '' : util.formatDate.format(new Date(para.dateout), 'yyyy-MM-dd');
							para.date = (!para.date || para.date == '') ? '' : Date.parse(new Date(para.date));
							para.dateout = (!para.dateout || para.dateout == '') ? '' : Date.parse(new Date(para.date));
							addUser(para).then((res) => {
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							}).catch( (err) => {
								this.$message({
									message: '提交失败',
									type: 'warning'
								});
								this.addLoading = false;
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					}).catch( (err) => {
						this.$message({
							message: '提交失败',
							type: 'info'
						});
						this.listLoading = false;
					});
				}).catch(() => {

				});
			},
			//下拉框变化事件
			selectChange: function (value) {
				console.log(value);
				let para = {
					value: value
				};
				getSelect().then((res) => {
					console.log(res)
					// let data = res.data;
					// this.pagenub = data.pageNum;
					// this.total = data.total;
					// this.users = data.list;
					// this.listLoading = false;
				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>