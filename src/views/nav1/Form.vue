<template>
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
</template>

<script>
	import util from '../../common/js/util'
	import { getUserListPage, addUser } from '../../api/api';
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				addFormVisible: true,//新增界面是否显示
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
				}
			}
		},
		methods: {
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							para.date = (!para.date || para.date == '') ? '' : util.formatDate.format(new Date(para.date), 'yyyy-MM-dd');
							para.dateout = (!para.dateout || para.dateout == '') ? '' : util.formatDate.format(new Date(para.dateout), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								console.log(para)
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				getUserListPage(para).then((res) => {
					console.log(res)
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
				});
			},
		},
		mounted() {
			this.getUsers();
		}
	}

</script>