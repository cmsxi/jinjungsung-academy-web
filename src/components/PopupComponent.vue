<template>
  <div class="popup-backdrop" v-if="visible">
    <div class="popup">
      <div class="popup-content">
        <button class="close-button" @click="$emit('close')">×</button>

        <div class="info-section">
          <h2>제목</h2>
          <p>설명</p>
          <p><strong>ADRESS</strong><br />주소</p>
          <p><strong>TEL / FAX</strong><br />번호</p>
          <p><strong>CONSULTATION HOURS</strong><br />근무시간</p>
          <p><strong>E-MAIL</strong><br />이메일 주소</p>
        </div>

        <div class="form-section">
          <h2>상담 신청</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="type">유형 *</label>
              <select id="type" v-model="formData.type" required>
                <option value="" disabled selected>선택</option>
                <option value="법인">법인</option>
                <option value="개인">개인</option>
              </select>
            </div>
            <div class="form-group">
              <label for="field">분야 *</label>
              <select id="field" v-model="formData.field" required>
                <option value="" disabled selected>선택</option>
                <option value="분야1">분야1</option>
                <option value="분야2">분야2</option>
              </select>
            </div>
            <div class="form-group">
              <label for="name">이름 *</label>
              <input type="text" id="name" v-model="formData.name" required />
            </div>
            <div class="form-group">
              <label for="email">이메일 *</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
              />
            </div>
            <div class="form-group">
              <label for="message">내용</label>
              <textarea id="message" v-model="formData.message"></textarea>
            </div>
            <button type="submit">상담 신청하기</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "PopupComponent",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        type: "",
        field: "",
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    submitForm() {
      alert(`상담 신청이 완료되었습니다.\n이름: ${this.formData.name}`);
      this.$emit("close");
    },
  },
};
</script>
  

<style scoped>
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: white;
  width: 90%;
  max-width: 1000px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.popup-content {
  display: flex;
  width: 100%;
}

.info-section {
  width: 300px;
  padding: 20px;
  background-color: #f9f9f9;
}

.info-section h2 {
  color: #018ccf;
  margin-bottom: 15px;
}

.info-section p {
  margin: 10px 0;
  line-height: 1.5;
}

.form-section {
  flex: 1;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: none;
  height: 80px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #018ccf;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  background-color: #f9f9f9;
  color: red;
}
</style>